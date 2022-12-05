import { CRDT as CRDTClass } from "./CRDT.js";
import type { CRDT, CRDTConfig } from "./interfaces";
import * as cborg from "cborg";

export class StateCRDT<T> extends CRDTClass implements Omit<CRDT, "toValue"> {
  protected readonly data = new Map<string, T>();
  private readonly compare: (a: T, b: T) => boolean;
  private readonly defaultValue?: T;

  constructor (config: CRDTConfig, compare: (a: T, b: T) => boolean, defaultValue?: T) {
    super(config);

    // Compare should return true if a is greater than b.
    this.compare = compare;
    this.defaultValue = defaultValue;
  }

  sync(data?: Uint8Array): Uint8Array | undefined {
    if (data == null) {
      return this.createSyncObj();
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
    const data = {
      id: this.id,
      sync: this.createSyncObj()
    };

    return cborg.encode(data);
  }

  private createSyncObj () {
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

      this.broadcast(cborg.encode({
        [id]: value
      }));
    }
  }

  onBroadcast(data: Uint8Array): void {
    const obj = cborg.decode(data);

    for (const [key, rValue] of Object.entries(obj)) {
      if (this.compareSelf(key, rValue as T)) {
        this.data.set(key, rValue as T);
      }
    }
  }

  // Returns true if the value passed is larger than the one stored.
  private compareSelf (key: string, value: T) {
    const lValue = this.data.get(key) ?? this.defaultValue;

    return lValue == null || this.compare(value, lValue);
  }
}
