// Utility functions for handling asset paths

export const getAssetPath = (path: string): string => {
  // Remove leading slash if present to make path relative
  const relativePath = path.startsWith('/') ? path.slice(1) : path
  return relativePath
}

export const getCharacterPath = (character: string, variant: string, animation: string, frame: string): string => {
  return getAssetPath(`assets/characters/${character}/${variant}/${animation}/${frame}`)
}