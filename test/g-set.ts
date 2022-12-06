import createSyncTests from "./sync.js";
import createSerialTests from "./serialize.js";
import createBroadcastTests from "./broadcast.js";
import type { GSet, CRDT, Deserialize } from "../src/interfaces.js";

export default (create: (id: string) => GSet<unknown> & CRDT, deserialize?: Deserialize<GSet<unknown> & CRDT> ) => {
  describe("Sync", () => {
  	createSyncTests(
  		(id: string) => create(id),
  		(crdt: GSet<unknown> & CRDT, index: number) => crdt.add(index + 1)
  	);
  });

  const dummy = create("dummy");

  if (dummy.addBroadcaster != null && dummy.onBroadcast != null) {
    describe("Broadcast", () => {
    	createBroadcastTests(
    		(id: string) => create(id),
    		(crdt: GSet<unknown> & CRDT, index: number) => crdt.add(index + 1)
    	);
    });
  }

  if (dummy.serialize != null && deserialize != null) {
    describe("Serialization", () => {
    	createSerialTests(
    		(id: string) => create(id),
    		(crdt: GSet<unknown> & CRDT, index: number) => crdt.add(index + 1),
    		deserialize
    	);
    });
  }
};
