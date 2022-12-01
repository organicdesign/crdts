import { CRDTConfig } from "./interfaces.js";

export class CRDT {
  protected readonly config: CRDTConfig;

  constructor (config: CRDTConfig) {
    this.config = config;
  }

  protected get id () {
    return this.config.id;
  }

  protected tryBroadcast (data: Uint8Array) {
    this.config.broadcast?.(data);
  }
}
