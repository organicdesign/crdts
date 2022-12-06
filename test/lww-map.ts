import createSyncTests from "./sync.js";
import createSerialTests from "./serialize.js";
import createBroadcastTests from "./broadcast.js";
import type { PNMap, CRDT, Deserialize } from "../src/interfaces.js";

export default (create: (id: string) => PNMap<unknown> & CRDT, deserialize?: Deserialize<PNMap<unknown> & CRDT> ) => {
  describe("Sync", () => {
  	createSyncTests(
  		(id: string) => create(id),
  		(crdt: PNMap<unknown> & CRDT, index: number) => crdt.set((index % 5).toString(), index + 1)
  	);
  });

  const dummy = create("dummy");

  if (dummy.addBroadcaster != null && dummy.onBroadcast != null) {
    describe("Broadcast", () => {
    	createBroadcastTests(
    		(id: string) => create(id),
    		(crdt: PNMap<unknown> & CRDT, index: number) => crdt.set((index % 5).toString(), index + 1)
    	);
    });
  }

  if (dummy.serialize != null && deserialize != null) {
    describe("Serialization", () => {
    	createSerialTests(
    		(id: string) => create(id),
    		(crdt: PNMap<unknown> & CRDT, index: number) => crdt.set((index % 5).toString(), index + 1),
    		deserialize
    	);
    });
  }
};
