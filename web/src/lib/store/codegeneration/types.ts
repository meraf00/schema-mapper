export const GENERATION_STATUS = 'GENERATION_STATUS';
export const LOAD_GENERATION_STATUS = `${GENERATION_STATUS}/load`;
export const SAVE_GENERATION_STATUS = `${GENERATION_STATUS}/save`;

export interface GenerationState {
  timestamp: number | null;
  status: string | null;
  id: string | null;
}
