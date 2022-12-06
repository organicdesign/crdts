import createSyncTests from "./sync.js";
import createSerialTests from "./serialize.js";
import createBroadcastTests from "./broadcast.js";
import type { GCounter, CRDT, Deserialize } from "../src/interfaces.js";

export default (create: (id: string) => GCounter & CRDT, deserialize: Deserialize<GCounter & CRDT> ) => {
  describe("Counter", () => {
  	it("Starts at 0", () => {
  		const counter = create("test");

  		expect(counter.toValue()).toBe(0);
  	});

  	it("Adds integers", () => {
  		const counter = create("test");
  		const integers = [1, 100, 53];
  		const sum = integers.reduce((p, c) => p + c, 0);

  		for (const integer of integers) {
  			counter.increment(integer);
  		}

  		expect(counter.toValue()).toBe(sum);
  	});

  	it("Adds floats", () => {
  		const counter = create("test");
  		const floats = [1, 100.23, 53.000001, 0.12];
  		const sum = floats.reduce((p, c) => p + c, 0);

  		for (const float of floats) {
  			counter.increment(float);
  		}

  		// Ensure consistent precision on floats.
  		expect(Math.floor((counter.toValue() as number) * 10000) / 10000).toBe(Math.floor(sum * 10000) / 10000);
  	});

  	it("Does not use negative values", () => {
  		const counter = create("test");
  		const integers = [1, -2, 100,  -3, 53];
  		const sum = integers.filter(i => i > 0).reduce((p, c) => p + c, 0);

  		for (const integer of integers) {
  			counter.increment(integer);
  		}

  		expect(counter.toValue()).toBe(sum);
  	});
  });

  describe("Sync", () => {
  	createSyncTests(
  		(id: string) => create(id),
  		(crdt: GCounter & CRDT, index: number) => crdt.increment(index + 1)
  	);
  });

  const dummy = create("dummy");

  if (dummy.addBroadcaster != null && dummy.onBroadcast != null) {
    describe("Broadcast", () => {
    	it("Does not broadcast when 0 or a negative value is passed", () => {
    		const broadcast = jest.fn();
    		const counter = create("test");
    		const values = [0, -1, -100];

    		counter.addBroadcaster!(broadcast);

    		for (const value of values) {
    			counter.increment(value);
    		}

    		expect(broadcast).not.toBeCalled();
    	});

    	createBroadcastTests(
    		(id: string) => create(id),
    		(crdt: GCounter & CRDT, index: number) => crdt.increment(index + 1)
    	);
    });
  }

  if (dummy.serialize != null && deserialize != null) {
    describe("Serialization", () => {
    	createSerialTests(
    		(id: string) => create(id),
    		(crdt: GCounter & CRDT, index: number) => crdt.increment(index + 1),
    		deserialize
    	);
    });
  }
};
