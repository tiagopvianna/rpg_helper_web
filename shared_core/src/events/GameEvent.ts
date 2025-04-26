import { EVENTS } from './EventTypes';

export type GameEvent =
  | PlayerMovedEvent
  | PlayerJoinedEvent

export type PlayerMovedEvent = {
  type: EVENTS.PLAYER_MOVED;
  playerId: string;
  position: { x: number; y: number };
};

export type PlayerJoinedEvent = {
  type: EVENTS.PLAYER_JOINED;
  playerId: string;
  position: { x: number; y: number };
};
