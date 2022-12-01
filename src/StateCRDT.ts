import { CRDT as CRDTClass } from "./CRDT.js";
import type { CRDT, CRDTConfig } from "./interfaces";
import * as cborg from "cborg";

export class StateCRDT<T> extends CRDTClass implements Omit<CRDT, "toValue"> {
  protected readonly data = new Map<string, T>();
  private readonly compare: (a: T, b: T) => boolean;

  constructor (config: CRDTConfig, compare: (a: T, b: T) => boolean) {
    super(config);

    this.compare = compare;
  }

  sync(data?: Uint8Array): Uint8Array | undefined {
    if (data == null) {
      return this.serialize();
    }

    const obj: Record<string, T> = cborg.decode(data);

    for (const [key, rValue] of Object.entries(obj)) {
      const lValue = this.data.get(key);

      if (lValue == null || this.compare(rValue, lValue)) {
        this.data.set(key, rValue);
      }
    }
  }

  serialize(): Uint8Array {
    const obj: Record<string, T> = {};

    for (const [key, value] of this.data) {
      obj[key] = value;
    }

    return cborg.encode(obj);
  }

  protected update (value: T) {
    const id = this.config.id;

    if (this.compareSelf(id, value)) {
      this.data.set(id, value);

      this.tryBroadcast(cborg.encode({
        [id]: value
      }));
    }
  }

  onBroadcast(data: Uint8Array): void {
    const obj = cborg.decode(data);

    for (const [key, rValue] of obj.entries()) {
      if (this.compareSelf(key, rValue)) {
        this.data.set(key, rValue);
      }
    }
  }

  // Returns true if the value passed is larger than the one stored.
  private compareSelf (key: string, value: T) {
    const lValue = this.data.get(key);

    return lValue == null || this.compare(value, lValue);
  }
}
