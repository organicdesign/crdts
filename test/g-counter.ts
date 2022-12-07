import createCRDTTests from "./crdt.js";
import type { MCounter, CRDT, Deserialize } from "../src/interfaces.js";

export default (
  create: (id: string) => MCounter & CRDT,
  deserialize?: Deserialize<MCounter & CRDT>
) => {
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

  createCRDTTests(
    create,
    (crdt: MCounter & CRDT, index: number) => crdt.increment(index + 1),
    deserialize
  );
};
