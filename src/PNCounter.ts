import * as cborg from "cborg";
import { CRDT as ICRDT, CRDTConfig, PNCounter as IPNCounter } from "./interfaces.js";
import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";

enum CounterType {
  PCounter,
  NCounter
}

export class PNCounter extends CRDT implements ICRDT, IPNCounter {
  private pCounter: GCounter;
  private nCounter: GCounter;

  constructor(config: CRDTConfig) {
    super(config);

    this.pCounter = new GCounter(config);
    this.nCounter = new GCounter(config);

    this.pCounter.addBroadcaster((data: Uint8Array) => this.broadcast(
      cborg.encode({ type: CounterType.PCounter, data})
    ));

    this.nCounter.addBroadcaster((data: Uint8Array) => this.broadcast(
      cborg.encode({ type: CounterType.NCounter, data})
    ));
  }

  sync(data?: Uint8Array): Uint8Array | undefined {
    if (data == null) {
      return cborg.encode([
        this.pCounter.sync(),
        this.nCounter.sync()
      ]);
    }

    let [pData, nData]: [Uint8Array?, Uint8Array?] = cborg.decode(data);

    if (pData != null) {
      pData = this.pCounter.sync(pData);
    }

    if (nData != null) {
      nData = this.nCounter.sync(nData);
    }

    if (pData == null && nData == null) {
      return;
    }

    return cborg.encode([pData, nData]);
  }

  serialize(): Uint8Array {
    return cborg.encode([
      this.pCounter.serialize(),
      this.nCounter.serialize()
    ]);
  }

  onBroadcast(data: Uint8Array): void {
    const { type, data: subData }: { type: CounterType, data: Uint8Array } = cborg.decode(data);

    if (type === CounterType.PCounter) {
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
