export type Role = 'TOP' | 'JUG' | 'MID' | 'ADC' | 'SPT';
export type TeamCode = 'GEN' | 'T1' | 'HLE' | 'DK' | 'KT' | 'FOX' | 'NS' | 'DRX' | 'BRO' | 'DNS';
export type Grade = 'S' | 'A' | 'B' | 'C';

export interface Player {
  id: string;
  name: string;
  role: Role;
  team: TeamCode;
  grade: Grade;
  cost: number;
  isRookie?: boolean;
}

