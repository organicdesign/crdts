import cborg from "cborg";

import { CRDT, GCounter as GC } from "./interfaces.js";
import { CRDT as CRDTClass }from "./CRDT.js";

export class GCounter extends CRDTClass implements CRDT, GC {
  private data = new Map<string, number>();

  sync(data?: Uint8Array | undefined): Uint8Array | undefined {
    if (data == null) {
      return this.serialize();
    }

    const obj: Record<string, number> = cborg.decode(data);

    for (const [key, value] of Object.entries(obj)) {
      if (this.data.get(key) ?? 0 < value) {
        this.data.set(key, value);
      }
    }
  }

  toValue(): number {
    return [...this.data.values()].reduce((p, c) => p + c, 0);
  }

  serialize(): Uint8Array {
    const obj: Record<string, number> = {};

    for (const [key, value] of this.data) {
      obj[key] = value;
    }

    return cborg.encode(obj);
  }

  increment(quantity: number): void {
    if (quantity < 0) {
      return;
    }

    const id = this.config.id;
    const cValue = this.data.get(id) ?? 0;
    const nValue = cValue + quantity;

    this.data.set(id, nValue);

    this.tryBroadcast(cborg.encode({
      [id]: nValue
    }));
  }
}
