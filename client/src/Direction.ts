export const Direction = {
    SOUTH: 0,
    SOUTHWEST: 1,
    WEST: 2,
    NORTHWEST: 3,
    NORTH: 4,
    NORTHEAST: 5,
    EAST: 6,
    SOUTHEAST: 7
  } as const;
  
  export type Direction = (typeof Direction)[keyof typeof Direction];