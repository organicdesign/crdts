import { CRDTConfig } from "./interfaces.js";

export class CRDT {
  protected readonly config: CRDTConfig;

  constructor (config: CRDTConfig) {
    this.config = config;
  }

  protected tryBroadcast (data: Uint8Array) {
    this.config.broadcast?.(data);
  }
}
