import * as Phaser from 'phaser';
import { sound } from '@/src/lib/game/soundEffects';

export interface FarmPlot {
  id: number;
  col: number;
  row: number;
  x: number;
  y: number;
  tilled: boolean;
  watered: boolean;
  cropId: string | null;
  cropName: string;
  stage: number; // 0: empty, 1: seed, 2: sprout, 3: growing, 4: mature/ripe
  sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
  soilSprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
  waterSheen?: Phaser.GameObjects.Graphics;
}

export interface FarmAnimal {
  id: string;
  type: 'cow' | 'sheep' | 'chicken' | 'chick' | 'bunny';
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  name: string;
  x: number;
  y: number;
  hearts: number;
}

export class MainFarmScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
  };

  private terraBot!: Phaser.GameObjects.Sprite;
  private plots: FarmPlot[] = [];
  private animals: FarmAnimal[] = [];
  private activeTool: string = 'water_can';
  private selectedSeedCrop: string = 'lentils';

  private activeZoneId: string | null = null;
  private promptContainer!: Phaser.GameObjects.Container;
  private promptText!: Phaser.GameObjects.Text;
  private floatingSpeechBubble!: Phaser.GameObjects.Container;
  private speechText!: Phaser.GameObjects.Text;

  private weatherParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private fallingPetals!: Phaser.GameObjects.Particles.ParticleEmitter;
  private currentWeather: string = 'sunny';

  // Callbacks to React UI
  private onInteractCallback?: (zoneId: string, plotData?: FarmPlot) => void;
  private onPlotUpdateCallback?: (plots: FarmPlot[]) => void;
  private onHarvestRewardCallback?: (cropName: string, coins: number, xp: number) => void;
  private onAnimalPetCallback?: (animalName: string) => void;

  constructor() {
    super({ key: 'MainFarmScene' });
  }

  public init(data: {
    onInteract?: (zoneId: string, plotData?: FarmPlot) => void;
    onPlotUpdate?: (plots: FarmPlot[]) => void;
    onHarvestReward?: (cropName: string, coins: number, xp: number) => void;
    onAnimalPet?: (animalName: string) => void;
    initialWeather?: string;
  }) {
    this.onInteractCallback = data.onInteract;
    this.onPlotUpdateCallback = data.onPlotUpdate;
    this.onHarvestRewardCallback = data.onHarvestReward;
    this.onAnimalPetCallback = data.onAnimalPet;
    if (data.initialWeather) {
      this.currentWeather = data.initialWeather;
    }
  }

  public setActiveTool(toolId: string, seedId?: string) {
    this.activeTool = toolId;
    if (seedId) {
      this.selectedSeedCrop = seedId;
    }
  }

  public setWeatherState(weather: string) {
    this.currentWeather = weather;
    if (this.weatherParticles) {
      if (weather === 'rain' || weather === 'storm') {
        this.weatherParticles.start();
        this.cameras.main.setAlpha(0.92);
      } else {
        this.weatherParticles.stop();
        this.cameras.main.setAlpha(1.0);
      }
    }
  }

  public advanceAllCrops() {
    this.plots.forEach(plot => {
      if (plot.tilled && plot.cropId && plot.stage > 0 && plot.stage < 4) {
        plot.stage = Math.min(4, plot.stage + 1);
        plot.watered = false; // needs fresh water each day
        this.updatePlotVisuals(plot);
      }
    });
    sound.playHarvest();
    this.showTerraSpeech("The sun rose! Crops advanced toward harvest! ☀️🌱");
    if (this.onPlotUpdateCallback) {
      this.onPlotUpdateCallback(this.plots);
    }
  }

  public plantBatchScenarioCrops(cropId: string, cropName: string) {
    this.plots.forEach((plot, i) => {
      if (i < 12) {
        plot.tilled = true;
        plot.watered = true;
        plot.cropId = cropId;
        plot.cropName = cropName;
        plot.stage = 3; // ready or near ready
        this.updatePlotVisuals(plot);
      }
    });
    sound.playHarvest();
    this.showTerraSpeech(`Planted 12 plots of ${cropName}! Water and watch them thrive! 🌱`);
    if (this.onPlotUpdateCallback) {
      this.onPlotUpdateCallback(this.plots);
    }
  }

  public triggerExternalInteraction() {
    if (this.activeZoneId && this.onInteractCallback) {
      sound.playBlip();
      this.onInteractCallback(this.activeZoneId);
      return;
    }

    // Otherwise interact with nearest plot
    const nearestPlot = this.getNearestPlot(this.player.x, this.player.y, 48);
    if (nearestPlot) {
      this.interactWithPlot(nearestPlot);
    }
  }

  public setMobileMove(vx: number, vy: number) {
    if (!this.player) return;
    const speed = 180;
    this.player.setVelocity(vx * speed, vy * speed);
    if (vx < 0) this.player.setFlipX(true);
    else if (vx > 0) this.player.setFlipX(false);
  }

  preload() {
    this.generateTopDownTextures();
  }

  create() {
    const worldW = 1600;
    const worldH = 1200;

    this.physics.world.setBounds(0, 0, worldW, worldH);

    // 1. Build Top-Down Farm Ground Terrain
    this.createTopDownTerrain(worldW, worldH);

    // 2. Build Cozy Buildings & Stations (Farmhouse, Barn, NASA Lab, Weather Station, Well, Shipping Bin)
    this.createFarmBuildings();

    // 3. Fencing & Animal Pen
    this.createFencesAndDecorations();

    // 4. Interactive 3x4 Farm Crop Beds (Stardew / Fields of Mistria style)
    this.createInteractiveFarmFields();

    // 5. Adorable Wandering Livestock Animals
    this.createFarmAnimals();

    // 6. Player Character
    this.createPlayer();

    // 7. Terra AI Floating Companion Bot
    this.createTerraCompanion();

    // 8. Particle Emitters (Falling Sakura Blossom Petals & Rain)
    this.createAmbientEmitters(worldW, worldH);

    // 9. Floating UI overlays (Speech bubbles, Action Prompts)
    this.createFloatingUI();

    // 10. Controls & Input
    this.setupInputs();

    // 11. Camera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.0);

    // Welcome speech
    this.time.delayedCall(800, () => {
      this.showTerraSpeech("Welcome to TerraFarm! Tap plots or press [E] with tools! 🌱❤️");
    });
  }

  // ----------------------------------------------------
  // TEXTURE GENERATION (Crisp Top-Down Pixel Art)
  // ----------------------------------------------------
  private generateTopDownTextures() {
    // 1. Top-Down Grass Tile (32x32)
    if (!this.textures.exists('td_grass')) {
      const g = this.textures.createCanvas('td_grass', 32, 32);
      if (g) {
        const ctx = g.context;
        ctx.fillStyle = '#8CD968'; // Warm Fields of Mistria emerald grass
        ctx.fillRect(0, 0, 32, 32);
        // Grass tufts and clover dots
        ctx.fillStyle = '#79C755';
        ctx.fillRect(4, 6, 2, 3);
        ctx.fillRect(6, 7, 2, 2);
        ctx.fillRect(20, 18, 2, 3);
        ctx.fillRect(22, 19, 2, 2);
        ctx.fillRect(12, 26, 2, 3);
        // Tiny white/yellow wildflower speckles
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(16, 8, 2, 2);
        ctx.fillStyle = '#FFEE58';
        ctx.fillRect(8, 22, 2, 2);
        g.refresh();
      }
    }

    // 2. Dirt Pathway Tile (32x32)
    if (!this.textures.exists('td_path')) {
      const p = this.textures.createCanvas('td_path', 32, 32);
      if (p) {
        const ctx = p.context;
        ctx.fillStyle = '#E2BA7D';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#CF9E5E';
        for (let i = 0; i < 16; i++) {
          ctx.fillRect((i * 7) % 30, (i * 11) % 30, 2, 2);
        }
        // Round river pebbles
        ctx.fillStyle = '#B08852';
        ctx.fillRect(8, 12, 4, 3);
        ctx.fillRect(22, 24, 4, 3);
        p.refresh();
      }
    }

    // 3. Dry Tilled Soil (36x36)
    if (!this.textures.exists('soil_dry')) {
      const s = this.textures.createCanvas('soil_dry', 36, 36);
      if (s) {
        const ctx = s.context;
        ctx.fillStyle = '#9C6136'; // Rich tilled brown
        ctx.fillRect(2, 2, 32, 32);
        // Furrow ridges
        ctx.fillStyle = '#7A4621';
        ctx.fillRect(4, 6, 28, 4);
        ctx.fillRect(4, 16, 28, 4);
        ctx.fillRect(4, 26, 28, 4);
        ctx.fillStyle = '#B87B4B';
        ctx.fillRect(4, 10, 28, 2);
        ctx.fillRect(4, 20, 28, 2);
        // Soft border
        ctx.strokeStyle = '#5E3416';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 32, 32);
        s.refresh();
      }
    }

    // 4. Wet Tilled Soil (36x36)
    if (!this.textures.exists('soil_wet')) {
      const sw = this.textures.createCanvas('soil_wet', 36, 36);
      if (sw) {
        const ctx = sw.context;
        ctx.fillStyle = '#5A3215'; // Dark saturated hydrated soil
        ctx.fillRect(2, 2, 32, 32);
        // Deep furrows
        ctx.fillStyle = '#3E200C';
        ctx.fillRect(4, 6, 28, 4);
        ctx.fillRect(4, 16, 28, 4);
        ctx.fillRect(4, 26, 28, 4);
        // Water sheen highlights
        ctx.fillStyle = '#7CA562';
        ctx.fillRect(6, 8, 8, 2);
        ctx.fillRect(18, 18, 10, 2);
        ctx.strokeStyle = '#2B1405';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 32, 32);
        sw.refresh();
      }
    }

    // 5. Wooden Fence Horizontal & Vertical
    if (!this.textures.exists('fence_h')) {
      const fh = this.textures.createCanvas('fence_h', 32, 24);
      if (fh) {
        const ctx = fh.context;
        // Two posts
        ctx.fillStyle = '#C89658';
        ctx.fillRect(2, 2, 6, 20);
        ctx.fillRect(24, 2, 6, 20);
        // Post caps
        ctx.fillStyle = '#DEAC74';
        ctx.fillRect(1, 0, 8, 3);
        ctx.fillRect(23, 0, 8, 3);
        // Horizontal rails
        ctx.fillStyle = '#B58245';
        ctx.fillRect(0, 6, 32, 4);
        ctx.fillRect(0, 14, 32, 4);
        fh.refresh();
      }
    }

    // 6. Farmhouse Cottage (Top-Down 110x100)
    if (!this.textures.exists('house_cottage')) {
      const hc = this.textures.createCanvas('house_cottage', 120, 110);
      if (hc) {
        const ctx = hc.context;
        // Stone walls
        ctx.fillStyle = '#D6CEB8';
        ctx.fillRect(12, 36, 96, 68);
        ctx.fillStyle = '#B8AE96';
        for (let y = 42; y < 100; y += 12) {
          for (let x = 16; x < 100; x += 20) {
            ctx.strokeRect(x, y, 16, 10);
          }
        }
        // Thatched/Slate Layered Roof
        ctx.fillStyle = '#7E634F';
        ctx.beginPath();
        ctx.moveTo(60, 4);
        ctx.lineTo(116, 38);
        ctx.lineTo(4, 38);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#654C3A';
        ctx.fillRect(6, 34, 108, 6);
        // Chimney
        ctx.fillStyle = '#A34835';
        ctx.fillRect(88, 8, 14, 22);
        ctx.fillStyle = '#732A1C';
        ctx.fillRect(86, 6, 18, 4);
        // Cozy Red Door with round brass handle
        ctx.fillStyle = '#B73229';
        ctx.fillRect(48, 64, 24, 40);
        ctx.fillStyle = '#8C211A';
        ctx.strokeRect(48, 64, 24, 40);
        ctx.fillStyle = '#FFCA28';
        ctx.fillRect(52, 82, 3, 3);
        // Window with Flower Planter Box
        ctx.fillStyle = '#81D4FA';
        ctx.fillRect(18, 54, 18, 18);
        ctx.fillStyle = '#5A4638';
        ctx.strokeRect(18, 54, 18, 18);
        // Flower Box
        ctx.fillStyle = '#8D5832';
        ctx.fillRect(16, 72, 22, 6);
        ctx.fillStyle = '#F48FB1'; // Pink blossoms
        ctx.fillRect(18, 69, 4, 3);
        ctx.fillRect(24, 69, 4, 3);
        ctx.fillRect(30, 69, 4, 3);
        hc.refresh();
      }
    }

    // 7. Red Barn (110x100)
    if (!this.textures.exists('barn_large')) {
      const bn = this.textures.createCanvas('barn_large', 120, 110);
      if (bn) {
        const ctx = bn.context;
        // Red wooden barn walls
        ctx.fillStyle = '#C63232';
        ctx.fillRect(10, 36, 100, 70);
        // White trim vertical siding
        ctx.fillStyle = '#9C2424';
        for (let x = 16; x < 105; x += 12) {
          ctx.fillRect(x, 36, 2, 70);
        }
        // White roof with trim
        ctx.fillStyle = '#EEEEEE';
        ctx.beginPath();
        ctx.moveTo(60, 6);
        ctx.lineTo(116, 38);
        ctx.lineTo(4, 38);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#BDBDBD';
        ctx.fillRect(6, 34, 108, 5);
        // Hayloft window
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(50, 16, 20, 18);
        ctx.fillStyle = '#C63232';
        ctx.fillRect(52, 18, 16, 14);
        // Sliding double barn door with white X brace
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(36, 62, 48, 44);
        ctx.fillStyle = '#A32828';
        ctx.fillRect(38, 64, 44, 40);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.strokeRect(38, 64, 44, 40);
        ctx.beginPath();
        ctx.moveTo(38, 64);
        ctx.lineTo(82, 104);
        ctx.moveTo(82, 64);
        ctx.lineTo(38, 104);
        ctx.stroke();
        bn.refresh();
      }
    }

    // 8. Stone Water Well (Top-Down 48x54)
    if (!this.textures.exists('well_topdown')) {
      const w = this.textures.createCanvas('well_topdown', 54, 58);
      if (w) {
        const ctx = w.context;
        // Stone circular ring
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.arc(27, 34, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#757575';
        ctx.beginPath();
        ctx.arc(27, 34, 16, 0, Math.PI * 2);
        ctx.fill();
        // Deep blue glistening water inside
        ctx.fillStyle = '#0288D1';
        ctx.beginPath();
        ctx.arc(27, 34, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#81D4FA';
        ctx.fillRect(23, 30, 8, 4);
        // Timber canopy roof
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(10, 14, 5, 24);
        ctx.fillRect(39, 14, 5, 24);
        ctx.fillStyle = '#4E342E';
        ctx.beginPath();
        ctx.moveTo(27, 2);
        ctx.lineTo(50, 18);
        ctx.lineTo(4, 18);
        ctx.closePath();
        ctx.fill();
        w.refresh();
      }
    }

    // 9. Shipping Chest (Wooden crate with brass trim)
    if (!this.textures.exists('chest_shipping')) {
      const cs = this.textures.createCanvas('chest_shipping', 36, 32);
      if (cs) {
        const ctx = cs.context;
        ctx.fillStyle = '#8D5326';
        ctx.fillRect(2, 4, 32, 24);
        ctx.fillStyle = '#6B3C17';
        ctx.strokeRect(2, 4, 32, 24);
        ctx.fillStyle = '#DEAC74';
        ctx.fillRect(2, 4, 32, 8); // Lid
        ctx.fillStyle = '#FFD54F';
        ctx.fillRect(16, 12, 4, 6); // Latch
        cs.refresh();
      }
    }

    // 10. Sakura Cherry Blossom Tree (Pastel Pink)
    if (!this.textures.exists('tree_sakura')) {
      const t = this.textures.createCanvas('tree_sakura', 80, 96);
      if (t) {
        const ctx = t.context;
        // Curved trunk
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(35, 54, 12, 38);
        ctx.fillRect(28, 62, 10, 8);
        // Canopy fluffy pink foliage layers
        ctx.fillStyle = '#F8BBD0';
        ctx.beginPath();
        ctx.arc(40, 36, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F48FB1';
        ctx.beginPath();
        ctx.arc(26, 42, 22, 0, Math.PI * 2);
        ctx.arc(54, 40, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FCE4EC';
        ctx.beginPath();
        ctx.arc(38, 28, 20, 0, Math.PI * 2);
        ctx.fill();
        // Tiny blossom highlights
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(26, 24, 3, 3);
        ctx.fillRect(44, 32, 3, 3);
        t.refresh();
      }
    }

    // 11. Pine Tree
    if (!this.textures.exists('tree_pine')) {
      const tp = this.textures.createCanvas('tree_pine', 64, 88);
      if (tp) {
        const ctx = tp.context;
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(28, 62, 8, 24);
        ctx.fillStyle = '#2E7D32';
        // 3 Tiers of pine needles
        ctx.beginPath();
        ctx.moveTo(32, 6);
        ctx.lineTo(54, 34);
        ctx.lineTo(10, 34);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(32, 24);
        ctx.lineTo(58, 52);
        ctx.lineTo(6, 52);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(32, 42);
        ctx.lineTo(62, 72);
        ctx.lineTo(2, 72);
        ctx.closePath();
        ctx.fill();
        tp.refresh();
      }
    }

    // 12. NASA Earth Observation Center
    if (!this.textures.exists('station_nasa_td')) {
      const ns = this.textures.createCanvas('station_nasa_td', 100, 90);
      if (ns) {
        const ctx = ns.context;
        // Sleek white and NASA blue lab building
        ctx.fillStyle = '#ECEFF1';
        ctx.fillRect(10, 28, 80, 56);
        ctx.fillStyle = '#0D47A1';
        ctx.fillRect(10, 30, 80, 8); // NASA Blue strip
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(46, 32, 8, 4); // Red meatball accent
        // Glass observation panels
        ctx.fillStyle = '#29B6F6';
        ctx.fillRect(18, 48, 24, 18);
        ctx.fillRect(58, 48, 24, 18);
        // Satellite Parabolic Dish on roof
        ctx.fillStyle = '#78909C';
        ctx.fillRect(48, 12, 4, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(50, 12, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(49, 2, 2, 10);
        ctx.fillStyle = '#FFEB3B';
        ctx.fillRect(48, 1, 4, 3);
        ns.refresh();
      }
    }

    // 13. Weather Station Tower
    if (!this.textures.exists('station_weather_td')) {
      const ws = this.textures.createCanvas('station_weather_td', 48, 70);
      if (ws) {
        const ctx = ws.context;
        ctx.fillStyle = '#607D8B';
        ctx.fillRect(22, 16, 4, 50);
        ctx.fillRect(12, 54, 24, 12);
        // Solar Collector
        ctx.fillStyle = '#1565C0';
        ctx.fillRect(8, 30, 32, 8);
        ctx.fillStyle = '#64B5F6';
        ctx.fillRect(10, 32, 28, 4);
        // Anemometer cups
        ctx.fillStyle = '#ECEFF1';
        ctx.fillRect(14, 10, 20, 3);
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(12, 10, 4, 0, Math.PI * 2);
        ctx.arc(36, 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ws.refresh();
      }
    }

    // 14. Crops Sprites: Radish/Turnip, Wheat, Tomato, Lentil, Cabbage
    // Turnip
    this.createCropTexture('crop_turnip_seed', 1, '#8D5524');
    this.createCropTexture('crop_turnip_sprout', 2, '#81C784');
    this.createTurnipMatureTexture();

    // Wheat
    this.createCropTexture('crop_wheat_sprout', 2, '#AED581');
    this.createWheatMatureTexture();

    // Tomato
    this.createCropTexture('crop_tomato_sprout', 2, '#4CAF50');
    this.createTomatoMatureTexture();

    // Lentil / Legume (with root nitrogen nodules)
    this.createLentilMatureTexture();

    // 15. Cute Animals (Cow, Sheep, Chicken, Chick, Bunny)
    this.createAnimalTextures();

    // 16. Player Character Top-Down (Farmer with green cap and overalls)
    this.createPlayerTexture();

    // 17. Terra AI Floating Bot
    this.createTerraBotTexture();
  }

  private createCropTexture(key: string, stage: number, color: string) {
    if (this.textures.exists(key)) return;
    const c = this.textures.createCanvas(key, 32, 32);
    if (!c) return;
    const ctx = c.context;
    if (stage === 1) {
      // Seed mound
      ctx.fillStyle = '#5A3215';
      ctx.beginPath();
      ctx.arc(16, 22, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#DEAC74';
      ctx.fillRect(14, 20, 4, 4);
    } else {
      // Small dual sprout leaves
      ctx.fillStyle = color;
      ctx.fillRect(15, 14, 2, 10);
      ctx.beginPath();
      ctx.ellipse(12, 16, 5, 3, -0.4, 0, Math.PI * 2);
      ctx.ellipse(20, 16, 5, 3, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    c.refresh();
  }

  private createTurnipMatureTexture() {
    if (this.textures.exists('crop_turnip_mature')) return;
    const c = this.textures.createCanvas('crop_turnip_mature', 32, 36);
    if (!c) return;
    const ctx = c.context;
    // Lush green leafy crown
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(16, 12, 10, 0, Math.PI * 2);
    ctx.arc(8, 16, 7, 0, Math.PI * 2);
    ctx.arc(24, 16, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(16, 10, 6, 0, Math.PI * 2);
    ctx.fill();
    // Pinkish-white turnip root poking above soil
    ctx.fillStyle = '#F48FB1';
    ctx.beginPath();
    ctx.arc(16, 25, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(16, 28, 5, 0, Math.PI * 2);
    ctx.fill();
    c.refresh();
  }

  private createWheatMatureTexture() {
    if (this.textures.exists('crop_wheat_mature')) return;
    const c = this.textures.createCanvas('crop_wheat_mature', 32, 36);
    if (!c) return;
    const ctx = c.context;
    // Golden stalks
    ctx.fillStyle = '#FDD835';
    for (let x = 8; x <= 24; x += 8) {
      ctx.fillRect(x, 10, 3, 20);
      // Wheat ears / grain spikes
      ctx.fillStyle = '#FFA000';
      ctx.fillRect(x - 2, 4, 7, 10);
      ctx.fillStyle = '#FFD54F';
      ctx.fillRect(x - 1, 6, 5, 6);
    }
    c.refresh();
  }

  private createTomatoMatureTexture() {
    if (this.textures.exists('crop_tomato_mature')) return;
    const c = this.textures.createCanvas('crop_tomato_mature', 32, 36);
    if (!c) return;
    const ctx = c.context;
    // Tomato bush vine
    ctx.fillStyle = '#1B5E20';
    ctx.beginPath();
    ctx.arc(16, 18, 12, 0, Math.PI * 2);
    ctx.fill();
    // Juicy red tomatoes
    ctx.fillStyle = '#D32F2F';
    const berries = [[10, 16], [22, 14], [16, 24], [12, 22]];
    berries.forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFCDD2';
      ctx.fillRect(bx - 2, by - 2, 2, 2);
      ctx.fillStyle = '#D32F2F';
    });
    c.refresh();
  }

  private createLentilMatureTexture() {
    if (this.textures.exists('crop_lentil_mature')) return;
    const c = this.textures.createCanvas('crop_lentil_mature', 32, 36);
    if (!c) return;
    const ctx = c.context;
    // Legume foliage
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(16, 16, 11, 0, Math.PI * 2);
    ctx.fill();
    // Pods
    ctx.fillStyle = '#81C784';
    ctx.fillRect(8, 12, 6, 3);
    ctx.fillRect(18, 16, 6, 3);
    ctx.fillRect(12, 22, 6, 3);
    // Biological Nitrogen glow particle dots around roots
    ctx.fillStyle = '#00E676';
    ctx.fillRect(6, 28, 3, 3);
    ctx.fillRect(23, 27, 3, 3);
    c.refresh();
  }

  private createAnimalTextures() {
    // 1. Spotted Dairy Cow (Top-down 44x34)
    if (!this.textures.exists('animal_cow')) {
      const c = this.textures.createCanvas('animal_cow', 44, 34);
      if (c) {
        const ctx = c.context;
        // White body
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(22, 18, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Black spots
        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(16, 14, 6, 0, Math.PI * 2);
        ctx.arc(28, 20, 7, 0, Math.PI * 2);
        ctx.arc(22, 22, 4, 0, Math.PI * 2);
        ctx.fill();
        // Head with pink snout
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(6, 16, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F8BBD0';
        ctx.fillRect(2, 14, 6, 6);
        // Horns & Ears
        ctx.fillStyle = '#DEAC74';
        ctx.fillRect(8, 7, 3, 3);
        ctx.fillRect(8, 21, 3, 3);
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(6, 13, 2, 2);
        c.refresh();
      }
    }

    // 2. Pink Fluffy Sheep (Fields of Mistria style 36x28)
    if (!this.textures.exists('animal_sheep')) {
      const s = this.textures.createCanvas('animal_sheep', 38, 30);
      if (s) {
        const ctx = s.context;
        // Fluffy pink wool cloud body
        ctx.fillStyle = '#F8BBD0';
        ctx.beginPath();
        ctx.arc(20, 16, 14, 0, Math.PI * 2);
        ctx.arc(12, 14, 10, 0, Math.PI * 2);
        ctx.arc(26, 14, 10, 0, Math.PI * 2);
        ctx.fill();
        // Cute face
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(7, 16, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillRect(5, 14, 2, 2);
        // Floppy ears
        ctx.fillStyle = '#F48FB1';
        ctx.fillRect(9, 10, 3, 4);
        s.refresh();
      }
    }

    // 3. Brown Hen (24x22)
    if (!this.textures.exists('animal_chicken')) {
      const h = this.textures.createCanvas('animal_chicken', 24, 22);
      if (h) {
        const ctx = h.context;
        ctx.fillStyle = '#8D5326';
        ctx.beginPath();
        ctx.arc(12, 12, 8, 0, Math.PI * 2);
        ctx.fill();
        // Red comb
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(4, 5, 4, 3);
        // Yellow beak
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(2, 11, 3, 3);
        // Eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(6, 9, 2, 2);
        h.refresh();
      }
    }

    // 4. Yellow Baby Chick (16x16)
    if (!this.textures.exists('animal_chick')) {
      const ch = this.textures.createCanvas('animal_chick', 16, 16);
      if (ch) {
        const ctx = ch.context;
        ctx.fillStyle = '#FFEE58';
        ctx.beginPath();
        ctx.arc(8, 9, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF9800';
        ctx.fillRect(2, 8, 3, 2); // beak
        ctx.fillStyle = '#000000';
        ctx.fillRect(5, 7, 2, 2); // eye
        ch.refresh();
      }
    }
  }

  private createPlayerTexture() {
    if (this.textures.exists('player_topdown')) return;
    const p = this.textures.createCanvas('player_topdown', 28, 40);
    if (!p) return;
    const ctx = p.context;
    // Green Cap (matching reference)
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(14, 12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1B5E20';
    ctx.fillRect(8, 12, 12, 4); // Visor brim

    // Face / skin
    ctx.fillStyle = '#F5D0A9';
    ctx.fillRect(9, 14, 10, 7);
    ctx.fillStyle = '#1A237E';
    ctx.fillRect(10, 16, 2, 2);
    ctx.fillRect(16, 16, 2, 2);

    // Overalls & Shirt (Orange vest / denim)
    ctx.fillStyle = '#E65100';
    ctx.fillRect(6, 22, 16, 10);
    ctx.fillStyle = '#1976D2'; // Blue denim strap
    ctx.fillRect(8, 22, 3, 8);
    ctx.fillRect(17, 22, 3, 8);

    // Legs / Boots
    ctx.fillStyle = '#455A64';
    ctx.fillRect(8, 32, 5, 7);
    ctx.fillRect(15, 32, 5, 7);
    p.refresh();
  }

  private createTerraBotTexture() {
    if (this.textures.exists('terra_drone_topdown')) return;
    const td = this.textures.createCanvas('terra_drone_topdown', 28, 28);
    if (!td) return;
    const ctx = td.context;
    // Round white floating body
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(14, 14, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00E676';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Green visor screen
    ctx.fillStyle = '#004D40';
    ctx.fillRect(8, 10, 12, 6);
    ctx.fillStyle = '#00E676';
    ctx.fillRect(10, 12, 2, 2);
    ctx.fillRect(16, 12, 2, 2);
    // Sprout antenna on top
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(13, 2, 2, 4);
    ctx.beginPath();
    ctx.ellipse(16, 2, 3, 2, 0.4, 0, Math.PI * 2);
    ctx.fill();
    td.refresh();
  }

  // ----------------------------------------------------
  // TERRAIN & SCENERY GENERATION
  // ----------------------------------------------------
  private createTopDownTerrain(worldW: number, worldH: number) {
    // 1. Fill base grass
    const tileW = 32;
    for (let y = 0; y < worldH; y += tileW) {
      for (let x = 0; x < worldW; x += tileW) {
        this.add.image(x + 16, y + 16, 'td_grass');
      }
    }

    // 2. Winding Dirt & Cobblestone Pathways (connecting Farmhouse -> Fields -> NASA -> Barn -> Well)
    const drawPath = (x1: number, y1: number, x2: number, y2: number) => {
      const dist = Phaser.Math.Distance.Between(x1, y1, x2, y2);
      const steps = Math.ceil(dist / 20);
      for (let s = 0; s <= steps; s++) {
        const px = Phaser.Math.Linear(x1, x2, s / steps);
        const py = Phaser.Math.Linear(y1, y2, s / steps);
        this.add.image(px, py, 'td_path');
        this.add.image(px + 16, py, 'td_path');
      }
    };

    // Paths
    drawPath(200, 200, 500, 200); // House to Center
    drawPath(500, 200, 500, 600); // Center to Fields
    drawPath(500, 600, 950, 600); // Fields to NASA & Weather
    drawPath(200, 200, 200, 550); // House to Well
    drawPath(500, 200, 850, 200); // Center to Barn
  }

  private createFarmBuildings() {
    // 1. Farmhouse Cottage
    const house = this.add.image(220, 170, 'house_cottage');
    house.setInteractive({ cursor: 'pointer' });
    house.on('pointerdown', () => {
      sound.playBlip();
      this.showTerraSpeech("The Farmhouse! Rest here to restore your energy ❤️");
    });

    // 2. Red Barn
    const barn = this.add.image(880, 160, 'barn_large');
    barn.setInteractive({ cursor: 'pointer' });
    barn.on('pointerdown', () => {
      sound.playBlip();
      if (this.onInteractCallback) {
        this.onInteractCallback('seed_shop');
      }
    });

    // 3. NASA Earth Observation Lab
    const nasa = this.add.image(950, 480, 'station_nasa_td');
    nasa.setInteractive({ cursor: 'pointer' });
    nasa.on('pointerdown', () => {
      sound.playBlip();
      if (this.onInteractCallback) {
        this.onInteractCallback('nasa');
      }
    });

    // NASA Radar Beacon Pulse
    const beacon = this.add.circle(950, 450, 5, 0x00E676);
    this.tweens.add({
      targets: beacon,
      scale: { from: 1, to: 2.5 },
      alpha: { from: 1, to: 0 },
      duration: 1200,
      repeat: -1
    });

    // 4. Weather Station
    const weatherStation = this.add.image(1120, 480, 'station_weather_td');
    weatherStation.setInteractive({ cursor: 'pointer' });
    weatherStation.on('pointerdown', () => {
      sound.playBlip();
      if (this.onInteractCallback) {
        this.onInteractCallback('weather');
      }
    });

    // 5. Aquifer Water Well
    const well = this.add.image(160, 440, 'well_topdown');
    well.setInteractive({ cursor: 'pointer' });
    well.on('pointerdown', () => {
      sound.playWater();
      this.showFloatingEffect(160, 400, "💧 REFILLED +20L WATER!");
      this.showTerraSpeech("The deep aquifer well provided fresh water! 💧");
      if (this.onInteractCallback) {
        this.onInteractCallback('well');
      }
    });

    // 6. Shipping Chest
    const chest = this.add.image(360, 210, 'chest_shipping');
    chest.setInteractive({ cursor: 'pointer' });
    chest.on('pointerdown', () => {
      sound.playCoin();
      this.showFloatingEffect(360, 180, "💰 SHIPPING BIN OPEN");
      this.showTerraSpeech("Crops in the shipping bin are sold overnight for coins! 💰");
    });
  }

  private createFencesAndDecorations() {
    // Sakura Blossom Trees along top ridge
    const sakuraCoords = [[90, 80], [380, 70], [680, 80], [1050, 80], [1300, 140]];
    sakuraCoords.forEach(([tx, ty]) => {
      const tree = this.add.image(tx, ty, 'tree_sakura');
      this.tweens.add({
        targets: tree,
        angle: { from: -1.5, to: 1.5 },
        duration: 3400 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    // Pine Trees on perimeter
    const pineCoords = [[80, 320], [80, 680], [80, 920], [1350, 380], [1350, 680], [1350, 920]];
    pineCoords.forEach(([px, py]) => {
      this.add.image(px, py, 'tree_pine');
    });

    // Fences enclosing the crop fields (left, right, top)
    const fxStart = 330;
    const fyStart = 400;
    for (let x = fxStart; x < fxStart + 420; x += 32) {
      this.add.image(x, fyStart - 20, 'fence_h');
      this.add.image(x, fyStart + 360, 'fence_h');
    }
  }

  // ----------------------------------------------------
  // INTERACTIVE CROP PLOTS (Tile-Based Farming)
  // ----------------------------------------------------
  private createInteractiveFarmFields() {
    const startX = 380;
    const startY = 440;
    const cols = 5;
    const rows = 4;
    const spacing = 58;

    let plotIndex = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = startX + c * spacing;
        const py = startY + r * spacing;

        // Base dry soil sprite
        const soilSprite = this.add.image(px, py, 'soil_dry');
        soilSprite.setInteractive({ cursor: 'pointer' });

        // Plant crop sprite
        const cropSprite = this.add.image(px, py - 4, 'crop_turnip_mature');
        cropSprite.setVisible(false);

        const plot: FarmPlot = {
          id: plotIndex++,
          col: c,
          row: r,
          x: px,
          y: py,
          tilled: true,
          watered: false,
          cropId: null,
          cropName: '',
          stage: 0,
          sprite: cropSprite,
          soilSprite: soilSprite
        };

        // Pre-plant half of them with sample crops so the farm looks lively on first open!
        if (r === 0) {
          plot.cropId = 'turnip';
          plot.cropName = 'Turnips';
          plot.stage = 4;
          plot.watered = true;
        } else if (r === 1 && c < 3) {
          plot.cropId = 'wheat';
          plot.cropName = 'Wheat';
          plot.stage = 3;
          plot.watered = true;
        } else if (r === 2 && c >= 2) {
          plot.cropId = 'lentils';
          plot.cropName = 'Lentils';
          plot.stage = 4;
          plot.watered = true;
        }

        this.updatePlotVisuals(plot);

        // Click on plot to perform active tool action
        soilSprite.on('pointerdown', () => {
          this.interactWithPlot(plot);
        });
        cropSprite.on('pointerdown', () => {
          this.interactWithPlot(plot);
        });

        this.plots.push(plot);
      }
    }
  }

  private interactWithPlot(plot: FarmPlot) {
    const tool = this.activeTool;

    if (tool === 'hoe') {
      plot.tilled = true;
      this.updatePlotVisuals(plot);
      sound.playStep();
      this.showFloatingEffect(plot.x, plot.y - 20, "⛏️ Tilled Soil!");
    } else if (tool === 'water_can') {
      if (plot.tilled) {
        plot.watered = true;
        this.updatePlotVisuals(plot);
        sound.playWater();
        this.showFloatingEffect(plot.x, plot.y - 20, "💧 Watered!");
        this.showTerraSpeech("Great watering! Moist soil enables seed germination!");
      }
    } else if (tool === 'seeds' || tool.startsWith('seed_')) {
      if (plot.tilled && plot.stage === 0) {
        plot.cropId = this.selectedSeedCrop;
        plot.cropName = this.selectedSeedCrop.charAt(0).toUpperCase() + this.selectedSeedCrop.slice(1);
        plot.stage = 1; // planted seed
        this.updatePlotVisuals(plot);
        sound.playBlip();
        this.showFloatingEffect(plot.x, plot.y - 20, `🌱 Planted ${plot.cropName}!`);
        this.showTerraSpeech(`Planted ${plot.cropName}! Now keep soil watered!`);
      } else if (plot.stage > 0) {
        this.showTerraSpeech("There is already a crop growing here!");
      }
    } else if (tool === 'scythe' || tool === 'harvest' || tool === 'hand') {
      if (plot.stage === 4) {
        // Harvest ripe crop!
        const harvestedName = plot.cropName;
        plot.stage = 0;
        plot.cropId = null;
        plot.cropName = '';
        plot.watered = false;
        this.updatePlotVisuals(plot);

        sound.playHarvest();
        const coins = 15;
        const xp = 20;
        this.showFloatingEffect(plot.x, plot.y - 30, `🌾 +${harvestedName}! (+$${coins}, +${xp}XP)`);
        this.showTerraSpeech(`Harvested fresh ${harvestedName}! Sold to market! 💰`);

        if (this.onHarvestRewardCallback) {
          this.onHarvestRewardCallback(harvestedName, coins, xp);
        }
      } else if (plot.stage > 0) {
        this.showTerraSpeech("This crop is still growing! Give it more sun and water!");
      }
    }

    if (this.onPlotUpdateCallback) {
      this.onPlotUpdateCallback(this.plots);
    }
  }

  private updatePlotVisuals(plot: FarmPlot) {
    // Soil texture: wet vs dry
    if (plot.watered) {
      plot.soilSprite.setTexture('soil_wet');
    } else {
      plot.soilSprite.setTexture('soil_dry');
    }

    // Crop visuals
    if (plot.stage === 0 || !plot.cropId) {
      plot.sprite.setVisible(false);
    } else if (plot.stage === 1) {
      plot.sprite.setTexture('crop_turnip_seed');
      plot.sprite.setVisible(true);
    } else if (plot.stage === 2) {
      plot.sprite.setTexture('crop_turnip_sprout');
      plot.sprite.setVisible(true);
    } else if (plot.stage === 3) {
      // Half grown
      if (plot.cropId === 'wheat') plot.sprite.setTexture('crop_wheat_sprout');
      else if (plot.cropId === 'tomato') plot.sprite.setTexture('crop_tomato_sprout');
      else plot.sprite.setTexture('crop_turnip_sprout');
      plot.sprite.setVisible(true);
    } else if (plot.stage === 4) {
      // Mature ripe crop!
      if (plot.cropId === 'wheat') plot.sprite.setTexture('crop_wheat_mature');
      else if (plot.cropId === 'tomato') plot.sprite.setTexture('crop_tomato_mature');
      else if (plot.cropId === 'lentils') plot.sprite.setTexture('crop_lentil_mature');
      else plot.sprite.setTexture('crop_turnip_mature');
      plot.sprite.setVisible(true);

      // Subtle ready-to-harvest bounce animation
      this.tweens.add({
        targets: plot.sprite,
        y: plot.y - 7,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  private getNearestPlot(px: number, py: number, maxDist: number = 48): FarmPlot | null {
    let nearest: FarmPlot | null = null;
    let minDist = maxDist;
    for (const plot of this.plots) {
      const dist = Phaser.Math.Distance.Between(px, py, plot.x, plot.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = plot;
      }
    }
    return nearest;
  }

  // ----------------------------------------------------
  // ADORABLE ANIMALS & PETTING
  // ----------------------------------------------------
  private createFarmAnimals() {
    // 1. Spotted Cow in pasture
    const cowSprite = this.physics.add.sprite(760, 240, 'animal_cow');
    this.setupAnimalAI(cowSprite, 'animal_cow', 'Bessie the Cow', 'cow');

    // 2. Pink Sheep
    const sheepSprite = this.physics.add.sprite(680, 280, 'animal_sheep');
    this.setupAnimalAI(sheepSprite, 'animal_sheep', 'Cotton the Sheep', 'sheep');

    // 3. Brown Hen
    const henSprite = this.physics.add.sprite(360, 360, 'animal_chicken');
    this.setupAnimalAI(henSprite, 'animal_chicken', 'Henrietta the Hen', 'chicken');

    // 4. Yellow Chick
    const chickSprite = this.physics.add.sprite(400, 370, 'animal_chick');
    this.setupAnimalAI(chickSprite, 'animal_chick', 'Pip the Chick', 'chick');
  }

  private setupAnimalAI(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    key: string,
    name: string,
    type: FarmAnimal['type']
  ) {
    sprite.setCollideWorldBounds(true);
    sprite.setInteractive({ cursor: 'pointer' });

    const animal: FarmAnimal = {
      id: `animal_${Math.random()}`,
      type,
      sprite,
      name,
      x: sprite.x,
      y: sprite.y,
      hearts: 0
    };
    this.animals.push(animal);

    // Wandering random walk timer
    this.time.addEvent({
      delay: 3000 + Math.random() * 2000,
      loop: true,
      callback: () => {
        const vx = (Math.random() - 0.5) * 40;
        const vy = (Math.random() - 0.5) * 40;
        sprite.setVelocity(vx, vy);
        if (vx < 0) sprite.setFlipX(true);
        else if (vx > 0) sprite.setFlipX(false);

        this.time.delayedCall(1200, () => {
          sprite.setVelocity(0, 0);
        });
      }
    });

    // Petting interaction
    sprite.on('pointerdown', () => {
      this.petAnimal(animal);
    });
  }

  private petAnimal(animal: FarmAnimal) {
    animal.hearts++;
    sound.playCoin();
    // Floating hearts
    this.showFloatingEffect(animal.sprite.x, animal.sprite.y - 24, "❤️ ❤️ ❤️");
    this.showTerraSpeech(`You petted ${animal.name}! Farm happiness +10! ❤️`);
    if (this.onAnimalPetCallback) {
      this.onAnimalPetCallback(animal.name);
    }
  }

  // ----------------------------------------------------
  // PLAYER & TERRA COMPANION
  // ----------------------------------------------------
  private createPlayer() {
    this.player = this.physics.add.sprite(420, 320, 'player_topdown');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 24);
    this.player.body.setOffset(4, 14);
  }

  private createTerraCompanion() {
    this.terraBot = this.add.sprite(this.player.x + 24, this.player.y - 20, 'terra_drone_topdown');
    this.terraBot.setInteractive({ cursor: 'pointer' });
    this.terraBot.on('pointerdown', () => {
      sound.playBlip();
      if (this.onInteractCallback) {
        this.onInteractCallback('terra');
      }
    });

    // Gentle hover bob
    this.tweens.add({
      targets: this.terraBot,
      y: '+=6',
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // ----------------------------------------------------
  // AMBIENT PARTICLES
  // ----------------------------------------------------
  private createAmbientEmitters(worldW: number, worldH: number) {
    // Sakura Blossom Falling Petals
    const pCanvas = this.textures.createCanvas('petal_pink', 6, 6);
    if (pCanvas) {
      const pctx = pCanvas.context;
      pctx.fillStyle = '#F48FB1';
      pctx.beginPath();
      pctx.arc(3, 3, 2.5, 0, Math.PI * 2);
      pctx.fill();
      pCanvas.refresh();
    }

    this.fallingPetals = this.add.particles(0, 0, 'petal_pink', {
      x: { min: 0, max: worldW },
      y: -10,
      lifespan: 8000,
      speedY: { min: 30, max: 70 },
      speedX: { min: -25, max: 15 },
      scale: { start: 1.0, end: 0.6 },
      quantity: 1,
      emitting: true
    });
    this.fallingPetals.setDepth(40);

    // Rain Emitter
    const rCanvas = this.textures.createCanvas('rain_drop', 2, 8);
    if (rCanvas) {
      const rctx = rCanvas.context;
      rctx.fillStyle = '#81D4FA';
      rctx.fillRect(0, 0, 2, 8);
      rCanvas.refresh();
    }

    this.weatherParticles = this.add.particles(0, 0, 'rain_drop', {
      x: { min: 0, max: worldW },
      y: -20,
      lifespan: 1400,
      speedY: { min: 450, max: 600 },
      speedX: { min: -50, max: -20 },
      quantity: 4,
      emitting: false
    });
    this.weatherParticles.setDepth(90);

    if (this.currentWeather === 'rain' || this.currentWeather === 'storm') {
      this.weatherParticles.start();
    }
  }

  // ----------------------------------------------------
  // FLOATING UI & DIALOGUE BUBBLES
  // ----------------------------------------------------
  private createFloatingUI() {
    // Speech Bubble container for Terra AI
    this.floatingSpeechBubble = this.add.container(0, 0);
    this.floatingSpeechBubble.setDepth(100);
    this.floatingSpeechBubble.setVisible(false);

    const sBg = this.add.graphics();
    sBg.fillStyle(0x0B1220, 0.94);
    sBg.lineStyle(2, 0x00E676, 1);
    sBg.fillRoundedRect(-140, -40, 280, 44, 12);
    sBg.strokeRoundedRect(-140, -40, 280, 44, 12);

    this.speechText = this.add.text(0, -18, '', {
      fontSize: '11px',
      color: '#FFFFFF',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      wordWrap: { width: 260 },
      align: 'center'
    });
    this.speechText.setOrigin(0.5);

    this.floatingSpeechBubble.add([sBg, this.speechText]);
  }

  public showTerraSpeech(msg: string) {
    this.speechText.setText(msg);
    this.floatingSpeechBubble.setPosition(this.terraBot.x, this.terraBot.y - 36);
    this.floatingSpeechBubble.setVisible(true);

    this.time.delayedCall(4500, () => {
      this.floatingSpeechBubble.setVisible(false);
    });
  }

  public showFloatingEffect(x: number, y: number, text: string) {
    const floatText = this.add.text(x, y, text, {
      fontSize: '12px',
      color: '#FFEE58',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    floatText.setOrigin(0.5);
    floatText.setDepth(110);

    this.tweens.add({
      targets: floatText,
      y: y - 35,
      alpha: { from: 1, to: 0 },
      duration: 1600,
      ease: 'Power2',
      onComplete: () => {
        floatText.destroy();
      }
    });
  }

  private setupInputs() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        E: Phaser.Input.Keyboard.KeyCodes.E,
        SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
      }) as typeof this.wasdKeys;

      this.wasdKeys.E.on('down', () => {
        this.triggerExternalInteraction();
      });
      this.wasdKeys.SPACE.on('down', () => {
        this.triggerExternalInteraction();
      });
    }

    // Click to move or farm
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // If clicking near a plot or animal, handle target
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const plot = this.getNearestPlot(worldPoint.x, worldPoint.y, 36);
      if (plot) {
        this.interactWithPlot(plot);
      }
    });
  }

  update() {
    if (!this.player) return;

    const speed = 180;
    let vx = 0;
    let vy = 0;

    const left = this.cursors?.left.isDown || this.wasdKeys?.A.isDown;
    const right = this.cursors?.right.isDown || this.wasdKeys?.D.isDown;
    const up = this.cursors?.up.isDown || this.wasdKeys?.W.isDown;
    const down = this.cursors?.down.isDown || this.wasdKeys?.S.isDown;

    if (left) {
      vx = -speed;
      this.player.setFlipX(true);
    } else if (right) {
      vx = speed;
      this.player.setFlipX(false);
    }

    if (up) vy = -speed;
    else if (down) vy = speed;

    this.player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      if (Math.random() < 0.04) {
        sound.playStep();
      }
    }

    // Terra Bot Smooth Follow
    if (this.terraBot) {
      const targetX = this.player.x + (this.player.flipX ? 24 : -24);
      const targetY = this.player.y - 20;
      this.terraBot.x = Phaser.Math.Linear(this.terraBot.x, targetX, 0.08);
      this.terraBot.y = Phaser.Math.Linear(this.terraBot.y, targetY, 0.08);
      if (this.floatingSpeechBubble.visible) {
        this.floatingSpeechBubble.setPosition(this.terraBot.x, this.terraBot.y - 36);
      }
    }
  }
}
