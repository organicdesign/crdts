import { CRDTConfig } from "./interfaces.js";

export class CRDT {
  protected readonly config: CRDTConfig;
  private readonly broadcasters: ((data: Uint8Array) => void)[] = []

  constructor (config: CRDTConfig) {
    this.config = config;
  }

  addBroadcaster (broadcaster: (data: Uint8Array) => void) {
    this.broadcasters.push(broadcaster);
  }

  protected get id () {
    return this.config.id;
  }

  protected broadcast (data: Uint8Array) {
    for (const broadcaster of this.broadcasters) {
      broadcaster(data);
    }
  }
}
