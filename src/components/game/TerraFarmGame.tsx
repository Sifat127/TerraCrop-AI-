import React, { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { MainFarmScene } from '@/src/game/scenes/MainFarmScene';
import { 
  PlayerStats, 
  GameWeatherScenario, 
  GameCrop, 
  HarvestResult, 
  NPCCharacter,
  GameQuest
} from '@/src/types/game';
import { 
  WEATHER_SCENARIOS, 
  INITIAL_QUESTS, 
  GAME_NPCS, 
  KNOWLEDGE_CARDS 
} from '@/src/lib/game/gameData';
import { GAME_CROPS } from '@/src/lib/game/cropData';
import { evaluateCropDecision } from '@/src/lib/game/decisionEngine';
import { sound } from '@/src/lib/game/soundEffects';

import { GameHUD } from './GameHUD';
import { DialogBox } from './DialogBox';
import { AskTerraModal } from './AskTerraModal';
import { NasaStationModal } from './NasaStationModal';
import { CropSelectModal } from './CropSelectModal';
import { SeasonSimulationModal } from './SeasonSimulationModal';
import { HarvestResultModal } from './HarvestResultModal';
import { KnowledgeBookModal } from './KnowledgeBookModal';
import { CropRotationModal } from './CropRotationModal';
import { QuestsModal } from './QuestsModal';
import { MobileGameControls } from './MobileGameControls';

interface TerraFarmGameProps {
  onReturnToApp: () => void;
  onTransferToRealApp: (params: {
    cropId: string;
    scenario: GameWeatherScenario;
    suitabilityScore: number;
  }) => void;
}

const PLAYER_TITLES = [
  'Farm Explorer',
  'Weather Watcher',
  'Crop Planner',
  'Water Manager',
  'Soil Guardian',
  'Climate Farmer',
  'Future Farmer'
];

export const TerraFarmGame: React.FC<TerraFarmGameProps> = ({
  onReturnToApp,
  onTransferToRealApp
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<MainFarmScene | null>(null);

  // Game state
  const [activeScenario, setActiveScenario] = useState<GameWeatherScenario>(WEATHER_SCENARIOS[0]);
  const [currentDay, setCurrentDay] = useState<number>(5);
  const [activeToolId, setActiveToolId] = useState<string>('water_can');
  const [selectedSeedCrop, setSelectedSeedCrop] = useState<string>('lentils');

  const [player, setPlayer] = useState<PlayerStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('terrafarm_player_state');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return {
      name: 'Young Farmer',
      energy: 160,
      maxEnergy: 200,
      water: 80,
      maxWater: 100,
      coins: 2910,
      knowledge: 98,
      level: 2,
      title: 'Weather Watcher',
      inventory: {
        seeds: { rice: 5, lentils: 8, maize: 5, wheat: 10, tomato: 6 },
        tools: ['Hoe', 'Watering Can', 'Scythe'],
        waterBuckets: 4
      }
    };
  });

  const [quests, setQuests] = useState<GameQuest[]>(INITIAL_QUESTS);
  const [unlockedCardIds, setUnlockedCardIds] = useState<string[]>(['k_rotation', 'k_smap', 'k_nitrogen']);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showControlsHelp, setShowControlsHelp] = useState(false);

  // Active Modals & Dialogs
  const [activeNpc, setActiveNpc] = useState<NPCCharacter | null>(null);
  const [isTerraModalOpen, setIsTerraModalOpen] = useState(false);
  const [isNasaModalOpen, setIsNasaModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatingCrop, setSimulatingCrop] = useState<GameCrop | null>(null);
  const [harvestResult, setHarvestResult] = useState<HarvestResult | null>(null);
  const [isFieldGuideOpen, setIsFieldGuideOpen] = useState(false);
  const [isRotationModalOpen, setIsRotationModalOpen] = useState(false);
  const [isQuestsModalOpen, setIsQuestsModalOpen] = useState(false);

  // Save player state changes
  useEffect(() => {
    localStorage.setItem('terrafarm_player_state', JSON.stringify(player));
  }, [player]);

  // Mount Phaser Game
  useEffect(() => {
    if (!containerRef.current) return;

    if (!phaserGameRef.current) {
      const scene = new MainFarmScene();
      sceneRef.current = scene;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 1280,
        height: 720,
        pixelArt: true,
        backgroundColor: '#8CD968',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
          }
        },
        scene: [scene]
      };

      const game = new Phaser.Game(config);
      phaserGameRef.current = game;

      // Pass scene hooks
      scene.init({
        onInteract: (zoneId) => handleZoneInteraction(zoneId),
        onHarvestReward: (cropName, coins, xp) => {
          awardPlayerRewards(xp, coins);
          markQuestCompleted('q_plant');
        },
        onAnimalPet: (animalName) => {
          awardPlayerRewards(10, 5);
        },
        initialWeather: 'sunny'
      });
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  // Update weather in Phaser when scenario changes
  const handleScenarioChange = (scenarioId: string) => {
    const sc = WEATHER_SCENARIOS.find(s => s.id === scenarioId) || WEATHER_SCENARIOS[0];
    setActiveScenario(sc);
    sound.playBlip();

    let weatherType = 'sunny';
    if (sc.id === 'scenario_heavy_rain') weatherType = 'rain';
    else if (sc.id === 'scenario_heat') weatherType = 'hot';
    else if (sc.id === 'scenario_drought') weatherType = 'dry';

    if (sceneRef.current) {
      sceneRef.current.setWeatherState(weatherType);
    }
  };

  const handleSelectTool = (toolId: string, seedCropId?: string) => {
    setActiveToolId(toolId);
    if (seedCropId) {
      setSelectedSeedCrop(seedCropId);
    }
    if (sceneRef.current) {
      sceneRef.current.setActiveTool(toolId, seedCropId);
    }
  };

  const handleAdvanceDay = () => {
    setCurrentDay(prev => prev + 1);
    setPlayer(prev => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + 40),
      water: Math.min(prev.maxWater, prev.water + 15)
    }));

    if (sceneRef.current) {
      sceneRef.current.advanceAllCrops();
    }
  };

  const handleZoneInteraction = (zoneId: string) => {
    switch (zoneId) {
      case 'weather': {
        const npcScientist: NPCCharacter = {
          id: 'weather_drone',
          name: 'Microclimate Station',
          role: 'Surface Anemometer & Radiometer',
          avatarColor: '#42A5F5',
          dialogue: [
            `Sensor Readout: Surface Air Temp: ${activeScenario.temperatureC}°C, Relative Humidity: 42%.`,
            `Seasonal Rainfall: ${activeScenario.rainfallMm}mm. Water budget availability is ${activeScenario.waterAvailability.toUpperCase()}.`,
            `NASA Context: ${activeScenario.nasaContext}`
          ],
          tip: 'Check crop water demands before planting in dry scenarios!'
        };
        setActiveNpc(npcScientist);
        markQuestCompleted('q_weather');
        break;
      }
      case 'nasa':
        setIsNasaModalOpen(true);
        markQuestCompleted('q_nasa');
        break;
      case 'terra':
        setIsTerraModalOpen(true);
        markQuestCompleted('q_terra');
        break;
      case 'field':
      case 'seed_shop':
        setIsCropModalOpen(true);
        break;
      case 'rotation':
        setIsRotationModalOpen(true);
        markQuestCompleted('q_rotation');
        break;
      case 'npc_grandparent': {
        const elder = GAME_NPCS.find(n => n.id === 'grandparent') || GAME_NPCS[0];
        setActiveNpc(elder);
        markQuestCompleted('q_explore');
        break;
      }
      case 'well': {
        sound.playWater();
        setPlayer(prev => ({
          ...prev,
          water: Math.min(prev.maxWater, prev.water + 30),
          energy: Math.min(prev.maxEnergy, prev.energy + 20)
        }));
        break;
      }
    }
  };

  const markQuestCompleted = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && !q.completed) {
        sound.playCoin();
        awardPlayerRewards(q.rewardKnowledge, q.rewardCoins);
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const awardPlayerRewards = (knowledgeXP: number, coins: number) => {
    setPlayer(prev => {
      const newKnowledge = prev.knowledge + knowledgeXP;
      const newCoins = prev.coins + coins;
      const newLevel = Math.min(7, Math.floor(newKnowledge / 40) + 1);
      const newTitle = PLAYER_TITLES[newLevel - 1] || PLAYER_TITLES[0];
      return {
        ...prev,
        knowledge: newKnowledge,
        coins: newCoins,
        level: newLevel,
        title: newTitle
      };
    });
  };

  // Planting Flow from Crop Select Modal
  const handlePlantCrop = (crop: GameCrop) => {
    setIsCropModalOpen(false);
    setSimulatingCrop(crop);
    setIsSimulating(true);

    if (sceneRef.current) {
      sceneRef.current.plantBatchScenarioCrops(crop.id, crop.name);
    }
  };

  // Simulation Finished Flow
  const handleSimulationComplete = () => {
    if (!simulatingCrop) return;
    setIsSimulating(false);

    const result = evaluateCropDecision(simulatingCrop, activeScenario);
    setHarvestResult(result);
    awardPlayerRewards(result.knowledgeGained, result.coinsEarned);
    markQuestCompleted('q_plant');
  };

  const handleApplyRotationToApp = (rotationCropIds: string[]) => {
    setIsRotationModalOpen(false);
    const primaryCrop = GAME_CROPS.find(c => c.id === rotationCropIds[0]) || GAME_CROPS[0];
    const evaluated = evaluateCropDecision(primaryCrop, activeScenario);
    onTransferToRealApp({
      cropId: primaryCrop.id,
      scenario: activeScenario,
      suitabilityScore: evaluated.suitabilityScore
    });
  };

  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#8CD968] flex items-center justify-center overflow-hidden">
      {/* 2D Top-Down Pixel Canvas Mount Target */}
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center cursor-crosshair"
      />

      {/* Retro Game HUD Layer with Authentic Clock & Hotbar */}
      <GameHUD
        player={player}
        scenario={activeScenario}
        onOpenFieldGuide={() => setIsFieldGuideOpen(true)}
        onOpenQuests={() => setIsQuestsModalOpen(true)}
        onOpenNASA={() => setIsNasaModalOpen(true)}
        onOpenTerra={() => setIsTerraModalOpen(true)}
        onOpenSeedDepot={() => setIsCropModalOpen(true)}
        onReturnToApp={onReturnToApp}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const newState = sound.toggle();
          setSoundEnabled(newState);
        }}
        onScenarioChange={handleScenarioChange}
        scenarios={WEATHER_SCENARIOS}
        showControlsHelp={showControlsHelp}
        onToggleControlsHelp={() => setShowControlsHelp(!showControlsHelp)}
        activeToolId={activeToolId}
        onSelectTool={handleSelectTool}
        onAdvanceDay={handleAdvanceDay}
        currentDay={currentDay}
      />

      {/* Mobile Touch Controls */}
      <MobileGameControls
        onMove={(vx, vy) => {
          if (sceneRef.current) {
            sceneRef.current.setMobileMove(vx, vy);
          }
        }}
        onInteract={() => {
          if (sceneRef.current) {
            sceneRef.current.triggerExternalInteraction();
          }
        }}
      />

      {/* NPC RPG Dialogue Modal */}
      {activeNpc && (
        <DialogBox
          npc={activeNpc}
          onClose={() => setActiveNpc(null)}
        />
      )}

      {/* Terra AI Agronomist Modal */}
      {isTerraModalOpen && (
        <AskTerraModal
          isOpen={isTerraModalOpen}
          onClose={() => setIsTerraModalOpen(false)}
          scenario={activeScenario}
          onCompareCrops={() => {
            setIsTerraModalOpen(false);
            setIsCropModalOpen(true);
          }}
        />
      )}

      {/* NASA Observation Center Modal */}
      {isNasaModalOpen && (
        <NasaStationModal
          isOpen={isNasaModalOpen}
          onClose={() => setIsNasaModalOpen(false)}
        />
      )}

      {/* Crop Decision Matrix Modal */}
      {isCropModalOpen && (
        <CropSelectModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          scenario={activeScenario}
          onPlantCrop={handlePlantCrop}
          farmerPriority={activeScenario.defaultPriority}
        />
      )}

      {/* Season Timeline Animated Simulation */}
      {isSimulating && simulatingCrop && (
        <SeasonSimulationModal
          crop={simulatingCrop}
          scenario={activeScenario}
          onSimulationComplete={handleSimulationComplete}
        />
      )}

      {/* Harvest & Crop Suitability Results Modal */}
      {harvestResult && (
        <HarvestResultModal
          result={harvestResult}
          onTryAnotherCrop={() => {
            setHarvestResult(null);
            setIsCropModalOpen(true);
          }}
          onOpenTerraCropAnalysis={(res) => {
            onTransferToRealApp({
              cropId: res.cropId,
              scenario: res.scenario,
              suitabilityScore: res.suitabilityScore
            });
          }}
          onAskTerra={() => {
            setHarvestResult(null);
            setIsTerraModalOpen(true);
          }}
        />
      )}

      {/* Farmer's Field Guide Modal */}
      {isFieldGuideOpen && (
        <KnowledgeBookModal
          isOpen={isFieldGuideOpen}
          onClose={() => setIsFieldGuideOpen(false)}
          unlockedCardIds={unlockedCardIds}
          onCompleteQuiz={(score) => {
            awardPlayerRewards(score * 20, score * 25);
          }}
        />
      )}

      {/* Multi-Year Crop Rotation Simulator */}
      {isRotationModalOpen && (
        <CropRotationModal
          isOpen={isRotationModalOpen}
          onClose={() => setIsRotationModalOpen(false)}
          onApplyRotationToApp={handleApplyRotationToApp}
        />
      )}

      {/* Quests & Milestones Modal */}
      {isQuestsModalOpen && (
        <QuestsModal
          isOpen={isQuestsModalOpen}
          onClose={() => setIsQuestsModalOpen(false)}
          quests={quests}
          onClaimReward={(qid) => markQuestCompleted(qid)}
          playerLevel={player.level}
          playerTitle={player.title}
        />
      )}
    </div>
  );
};
