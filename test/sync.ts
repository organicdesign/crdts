import { syncCrdts } from "../src/utils.js";
import type { CRDT } from "../src/interfaces.js";

export default <T extends CRDT=CRDT>(
  create: (id: string) => T,
  action: (crdt: T, index: number) => void,
  instanceCount?: number
) => {
  if (instanceCount == null) {
    instanceCount = 20;
  }

  const name = create("dummy").constructor.name;

  const runSyncTest = (count: number) => {
    const crdts: T[] = [];

    for (let i = 1; i <= count; i++) {
      const crdt = create(`test-${i}`);

      action(crdt, i);

      crdts.push(crdt);
    }

    syncCrdts(crdts);

    const result = crdts[0].toValue();

    for (const crdt of crdts) {
      expect(crdt.toValue()).toStrictEqual(result);
    }
  };

  const runBroadcastTest = (count: number) => {
    const crdts: T[] = [];

    const createBroadcast = (crdt: T) => (data: Uint8Array) => {
      for (const rCrdt of crdts) {
        // Don't broadcast to self.
        if (rCrdt === crdt) {
          continue;
        }

        rCrdt.onBroadcast?.(data);
      }
    };

    for (let i = 1; i <= count; i++) {
      const crdt = create(`test-${i}`);

      crdt.addBroadcaster?.(createBroadcast(crdt));

      crdts.push(crdt);
    }

    for (let i = 0; i < crdts.length; i++) {
      action(crdts[i], i);
    }

    const value = crdts[0].toValue();

    for (const crdt of crdts) {
      expect(crdt.toValue()).toStrictEqual(value);
    }
  }

  it(`Syncs 2 ${name}s`, () => {
    runSyncTest(2);
  });

  it(`Syncs ${instanceCount} ${name}s`, () => {
    runSyncTest(20);
  });

  const dummy = create("dummy");

  if (dummy.addBroadcaster != null && dummy.onBroadcast != null) {
    it(`Syncs 2 ${name}s over broadcast`, () => {
      runBroadcastTest(2);
    });

  	it(`Syncs ${instanceCount} ${name}s over broadcast`, () => {
  		runBroadcastTest(instanceCount as number);
  	});
  }
};
