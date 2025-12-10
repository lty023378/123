
export enum GameState {
  MENU = 'MENU',
  INTRO = 'INTRO',
  HUB = 'HUB',
  GAME_PURIFY = 'GAME_PURIFY',
  GAME_EXPLORE = 'GAME_EXPLORE',
  GAME_CLEANUP = 'GAME_CLEANUP',
  GAME_CHAIN = 'GAME_CHAIN',
  GAME_ECO_SIM = 'GAME_ECO_SIM', // New Simulation Mode
  BIODEX = 'BIODEX',
  CHAT = 'CHAT'
}

export interface Animal {
  id: string;
  name: string;
  description: string;
  image: string;
  soundDescription: string;
  found: boolean;
  fact: string;
}

export interface Plant {
  id: string;
  name: string;
  role: string; // e.g., "Removes Nitrogen"
  power: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export type UnlockStatus = {
  [key: string]: boolean;
}

export interface TrashItem {
  id: string;
  name: string;
  emoji: string;
  type: 'recycle' | 'harmful' | 'organic'; // Bin types
}

export interface ChainLevel {
  id: string;
  name: string;
  emoji: string;
}

export interface FoodChain {
  id: number;
  items: ChainLevel[]; // In order: Producer -> Consumer -> Predator
  description: string;
}

// --- Eco Sim Types ---

export type TerrainType = 'deep_water' | 'shallow_water' | 'land';
export type SimEntityType = 'trash' | 'snail' | 'bug' | 'grass' | 'lotus' | 'carp' | 'frog' | 'heron' | 'stork';

export interface SimCell {
  row: number;
  col: number;
  terrain: TerrainType;
  entity: SimEntityType | null;
}

export interface SimLevel {
  id: number;
  budget: number;
  missionDescription: string;
  missionTarget: { type: SimEntityType, count: number }[];
  initialGrid: { row: number, col: number, terrain: TerrainType, entity?: SimEntityType }[];
}

export interface SimTool {
  id: SimEntityType | 'clean';
  name: string;
  emoji: string;
  cost: number;
  description: string;
}