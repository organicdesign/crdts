import createSyncTests from "./sync.js";
import createSerialTests from "./serialize.js";
import createBroadcastTests from "./broadcast.js";
import type { PNCounter, CRDT, Deserialize } from "../src/interfaces.js";

export default (create: (id: string) => PNCounter & CRDT, deserialize?: Deserialize<PNCounter & CRDT> ) => {
  describe("Counter", () => {
    it("Starts at 0", () => {
  		const counter = create("test");

  		expect(counter.toValue()).toBe(0);
  	});

  	it("Adds integers", () => {
  		const counter = create("test");
  		const integers = [1, -100, 53];
  		const sum = integers.reduce((p, c) => p + c, 0);

  		for (const integer of integers) {
  			if (integer > 0) {
  				counter.increment(integer);
  			} else {
  				counter.decrement(-integer);
  			}
  		}

  		expect(counter.toValue()).toBe(sum);
  	});

  	it("Adds floats", () => {
  		const counter = create("test");
  		const floats = [1, 100.23, -53.00001, 0.12];
  		const sum = floats.reduce((p, c) => p + c, 0);

  		for (const float of floats) {
  			if (float > 0) {
  				counter.increment(float);
  			} else {
  				counter.decrement(-float);
  			}
  		}

  		// Ensure consistent precision on floats.
  		expect(Math.floor((counter.toValue() as number) * 10000) / 10000).toBe(Math.floor(sum * 10000) / 10000);
  	});
  });

  describe("Sync", () => {
  	createSyncTests(
  		(id: string) => create(id),
  		(crdt: PNCounter & CRDT, index: number) => crdt.increment(index + 1)
  	);
  });

  const dummy = create("dummy");

  if (dummy.addBroadcaster != null && dummy.onBroadcast != null) {
    describe("Broadcast", () => {
    	it("Does not broadcast when 0 or negative values are passed", () => {
    		const broadcast = jest.fn();
    		const counter = create("test");
    		const values = [0, -1, -100];

    		counter.addBroadcaster!(broadcast);

    		for (const value of values) {
    			counter.increment(value);
    		}

    		for (const value of values) {
    			counter.decrement(value);
    		}

    		expect(broadcast).not.toBeCalled();
    	});

    	createBroadcastTests(
    		(id: string) => create(id),
    		(crdt: PNCounter & CRDT, index: number) => index % 2 === 0 ? crdt.increment(index + 1) : crdt.decrement(index + 1)
    	);
    });
  }

  if (dummy.serialize != null && deserialize != null) {
    describe("Serialization", () => {
    	createSerialTests(
    		(id: string) => create(id),
    		(crdt: PNCounter & CRDT, index: number) => index % 2 === 0 ? crdt.increment(index + 1) : crdt.decrement(index + 1),
    		deserialize
    	);
    });
  }
};
