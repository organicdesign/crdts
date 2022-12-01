import * as cborg from "cborg";
import { CRDT as ICRDT, CRDTConfig, PNCounter as IPNCounter } from "./interfaces.js";
import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";

export class PNCounter extends CRDT implements ICRDT, IPNCounter {
  private pCounter: GCounter;
  private nCounter: GCounter;

  constructor(config: CRDTConfig) {
    super(config);

    const createConfig = (type: "p" | "n") => ({
      ...config,
      broadcast: (data: Uint8Array) => {
        this.tryBroadcast(cborg.encode({
          type,
          data
        }));
      }
    });

    this.pCounter = new GCounter(createConfig("p"));
    this.nCounter = new GCounter(createConfig("n"));
  }

  sync(data?: Uint8Array): Uint8Array | undefined {
    if (data == null) {
      return cborg.encode([
        this.pCounter.sync(),
        this.nCounter.sync()
      ]);
    }

    const [pData, nData]: [Uint8Array, Uint8Array] = cborg.decode(data);

    return cborg.encode([
      this.pCounter.sync(pData),
      this.nCounter.sync(nData)
    ]);
  }

  serialize(): Uint8Array {
    return cborg.encode([
      this.pCounter.serialize(),
      this.nCounter.serialize()
    ]);
  }

  onBroadcast(data: Uint8Array): void {
    const { type, data: subData }: { type: "p" | "n", data: Uint8Array } = cborg.decode(data);

    if (type === "p") {
      this.pCounter.onBroadcast(subData);
    } else {
      this.nCounter.onBroadcast(subData);
    }
  }

  toValue(): number {
    return this.pCounter.toValue() - this.nCounter.toValue();
  }

  increment(quantity: number): void {
    this.pCounter.increment(quantity);
  }

  decrement(quantity: number): void {
    this.nCounter.increment(quantity);
  }
}
