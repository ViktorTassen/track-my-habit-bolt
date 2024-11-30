export const CHARACTERS = {
  CuteCat: {
    name: 'Cute Cat',
    description: 'A charming feline companion',
    variants: {
      Character01: { name: 'Orange Tabby', description: 'A friendly orange cat' },
      Character02: { name: 'Gray Tabby', description: 'A mysterious gray cat' },
      Character03: { name: 'Black Cat', description: 'A lucky black cat' }
    }
  },
  CartoonPenguin: {
    name: 'Cartoon Penguin',
    description: 'An adorable penguin friend',
    variants: {
      Character01: { name: 'Classic', description: 'A cheerful penguin' }
    }
  }
} as const

export type CharacterType = keyof typeof CHARACTERS
export type CharacterVariant<T extends CharacterType> = keyof typeof CHARACTERS[T]['variants']