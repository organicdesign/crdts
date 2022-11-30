import type { CRDT } from "./interfaces";

export class CRDTMap implements CRDT, Omit<Map<string, CRDT>, "clear" | "delete"> {
  private data = new Map<string, CRDT>();

  constructor (settings) {
    // settings.broadcast
    // settings.id
  }

  serialize(): Uint8Array {
    throw new Error("Method not implemented.");
  }

  sync(data?: Uint8Array): Uint8Array {
    throw new Error("Method not implemented.");
  }

  toValue (): Map<string, unknown> {
    const output = new Map<string, unknown>();

    for (const [key, value] of this.data) {
      output.set(key, value?.toValue());
    }

    return output;
  }

  forEach(callbackfn: (value: CRDT, key: string, map: Map<string, CRDT>) => void, thisArg?: any): void {
    for (const [key, value] of this.data) {
      callbackfn(value, key, thisArg ?? this.data);
    }
  }

  get(key: string): CRDT | undefined {
    return this.data.get(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  set(key: string, value: CRDT): Map<string, CRDT> {
    return this.data.set(key, value);
  }

  get size (): number {
    return this.data.size;
  }

  entries(): IterableIterator<[string, CRDT]> {
    return this.data.entries();
  }

  keys(): IterableIterator<string> {
    return this.data.keys()
  }

  values(): IterableIterator<CRDT> {
    return this.data.values();
  }

  [Symbol.iterator](): IterableIterator<[string, CRDT]> {
    return this.entries();
  }

  [Symbol.toStringTag]: string;
}
