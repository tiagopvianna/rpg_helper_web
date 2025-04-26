type Position = { x: number; y: number };

export class Player {
  public id: string;
  public position: Position;

  constructor(id: string, position: Position) {
    this.id       = id;
    // shallow‐clone so external changes to `position` don’t leak in:
    this.position = { ...position };
  }

  /** Move by a delta vector. */
  move(delta: Position): void {
    // recompute a fresh object rather than mutating nested fields
    this.position = {
      x: this.position.x + delta.x,
      y: this.position.y + delta.y,
    };
  }

  clone(): Player {
    // spread again to avoid sharing the same object
    return new Player(this.id, { ...this.position });
  }
}
