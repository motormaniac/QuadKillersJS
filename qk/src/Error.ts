const SAFE_MODE = true; // false for debugging. When true, errors are printed but not thrown.

/**
 * Error philosophy: During development, logErrors will catch problems. During production, problems should result in non-functioning code but not crash the game.
 * @param message 
 */
export function logError(message: string): void{
  if (SAFE_MODE) {
    console.error(message);
  } else {
    throw new Error(message);
  }
}