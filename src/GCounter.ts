import { CRDT, CRDTConfig, GCounter as GC } from "./interfaces.js";
import { StateCRDT } from "./StateCRDT.js";

export class GCounter extends StateCRDT<number> implements CRDT, GC {
  constructor(config: CRDTConfig) {
    super(config, (a: number, b:number) => a > b);
  }

  toValue(): number {
    return [...this.data.values()].reduce((p, c) => p + c, 0);
  }

  increment(quantity: number): void {
    if (quantity < 0) {
      return;
    }

    const id = this.config.id;
    const cValue = this.data.get(id) ?? 0;
    const nValue = cValue + quantity;

    this.update(nValue);
  }
}
