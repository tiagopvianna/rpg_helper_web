import { EVENTS } from './EventTypes';

export type GameEvent =
  | PlayerMovedEvent
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | PlayerAttackedEvent;

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

export type PlayerLeftEvent = {
  type: EVENTS.PLAYER_LEFT;
  playerId: string;
};

export type PlayerAttackedEvent = {
  type: EVENTS.PLAYER_ATTACKED;
  playerId: string;
};
