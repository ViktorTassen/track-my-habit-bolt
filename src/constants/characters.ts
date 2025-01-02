export interface CharacterVariant {
    id: string;
    animations: {
      [key: string]: {
        frameCount: number;
        frameRate: number; // frames per second
      };
    };
  }
  
  export interface Character {
    id: string;
    name: string;
    variants: CharacterVariant[];
  }
  
  export const CHARACTERS: Character[] = [
    {
      id: 'CuteCat',
      name: 'Cute Cat',
      variants: [
        {
          id: 'Character01',
          animations: {
            Idle: {
              frameCount: 20, // 00.png to 19.png
              frameRate: 30
            },
            Hit: {
              frameCount: 50, // 00.png to 49.png
              frameRate: 30
            }
          }
        }
      ]
    }
  ];