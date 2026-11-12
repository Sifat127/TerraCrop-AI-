/**
 * Cloudflare Turnstile Verification Utility
 * Validates Turnstile tokens server-side using the Cloudflare Siteverify API.
 * In development, standard test keys (1x00000000000000000000AA) are accepted gracefully.
 */

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
  challengeTs?: string;
  hostname?: string;
  isMocked?: boolean;
}

const CLOUDFLARE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(
  token: string, 
  remoteIp?: string
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '';

  // Development bypass or test key check
  const isDev = process.env.NODE_ENV !== 'production';
  const isTestKey = token.startsWith('XXXX.') || token === 'test-token' || token.length < 20;

  if (!secretKey || secretKey.includes('YOUR_TURNSTILE') || (isDev && isTestKey)) {
    return {
      success: true,
      isMocked: true,
      hostname: 'localhost'
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch(CLOUDFLARE_SITEVERIFY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const outcome = await response.json() as any;

    return {
      success: Boolean(outcome.success),
      errorCodes: outcome['error-codes'],
      challengeTs: outcome.challenge_ts,
      hostname: outcome.hostname,
      isMocked: false
    };
  } catch (error: any) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      errorCodes: ['internal-verification-failure']
    };
  }
}
