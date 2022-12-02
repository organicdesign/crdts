import * as cborg from "cborg";
import { CRDT } from "./CRDT.js"
import type { CRDT as ICRDT, GMap, CRDTConfig } from "./interfaces.js";

export class CRDTMap<T extends ICRDT=ICRDT> extends CRDT implements ICRDT, GMap<ICRDT> {
  protected data = new Map<string, T>();

  constructor (config: CRDTConfig) {
    super(config);
  }

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return this.data[Symbol.iterator]();
  }

  forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void {
    return this.data.forEach(callbackfn, thisArg);
  }

  get(key: string): T | undefined {
    return this.data.get(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  set(key: string, value: T): Map<string, T> {
    value.addBroadcaster?.((data: Uint8Array) => {
      this.broadcast(cborg.encode({
        [key]: data
      }))
    });
    return new Map(this.data.set(key, value));
  }

  get size(): number {
    return this.data.size;
  }

  entries(): IterableIterator<[string, T]> {
    return this.data.entries();
  }

  keys(): IterableIterator<string> {
    return this.data.keys();
  }

  values(): IterableIterator<T> {
    return this.data.values();
  }

  sync(data?: Uint8Array): Uint8Array | undefined {
    if (data == null) {
      const obj: Record<string, Uint8Array> = {};

      for (const [key, crdt] of this.data.entries()) {
        obj[key] = crdt.sync() as Uint8Array;
      }

      return cborg.encode(obj);
    }

    const decoded = cborg.decode(data) as Record<string, Uint8Array>;
    const obj: Record<string, Uint8Array> = {};

    for (const [key, subdata] of Object.entries(decoded)) {
      const result = this.data.get(key)?.sync(subdata);

      if (result != null) {
        obj[key] = result;
      }
    }

    if (Object.values(obj).length > 0) {
      return cborg.encode(obj);
    }
  }

  toValue(): Map<string, unknown> {
    const output = new Map<string, unknown>();

    for (const [key, crdt] of this.data.entries()) {
      output.set(key, crdt.toValue());
    }

    return output;
  }

  serialize(): Uint8Array {
    const obj: Record<string, Uint8Array> = {};

    for (const [key, crdt] of this.data.entries()) {
      obj[key] = crdt.serialize();
    }

    return cborg.encode(obj);
  }

  onBroadcast(data: Uint8Array): void {
    const decoded: Record<string, Uint8Array> = cborg.decode(data);

    for (const [key, value] of Object.entries(decoded)) {
      this.get(key)?.onBroadcast?.(value);
    }
  }
}
