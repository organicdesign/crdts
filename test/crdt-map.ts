import createCRDTTests from "./crdt.js";
import type { MMap, CRDT, Deserialize } from "../src/interfaces.js";

interface Actionable {
  action (index: number): void
}

const createDummyCRDT = (): CRDT & Actionable => {
  let pData = new Uint8Array([0]);
  const broadcasters: ((data: Uint8Array) => void)[] = [];

  const update = (data: Uint8Array) => {
    if (data.toString() > pData.toString()) {
      pData = data;
      return true;
    }

    return false;
  }

  return {
    action: (index: number) => {
      const data = new Uint8Array([index + 1]);

      update(data);

      for (const broadcast of broadcasters) {
        broadcast(data);
      }
    },

    sync: (data: Uint8Array) => {
      if (data == null) {
        return pData;
      }

      update(data);
    },

    toValue: () => pData,

    addBroadcaster: (broadcaster: (data: Uint8Array) => void) => broadcasters.push(broadcaster),

    onBroadcast: (data: Uint8Array) => {
      update(data);
    }
  }
};

export default (
  create: (id: string) => MMap<CRDT> & CRDT,
  deserialize?: Deserialize<MMap<CRDT> & CRDT>
) => {
  const createWithDummies = (id: string) => {
    const crdt = create(id);

    crdt.set("dummy1", createDummyCRDT());
    crdt.set("dummy2", createDummyCRDT());

    return crdt;
  };

  const action = (crdt: MMap<CRDT & Actionable> & CRDT, index: number) => {
    const name = index % 2 === 0 ? "dummy1" : "dummy2";

    const subCrdt = crdt.get(name);

    if (subCrdt == null) {
      return;
    }

    subCrdt.action(index);
  };

  createCRDTTests(
    createWithDummies,
    action,
    deserialize
  );
};
