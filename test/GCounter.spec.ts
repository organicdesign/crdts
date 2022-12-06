import { GCounter, deserializeGCounter } from "../src/GCounter.js";
import createSyncTests from "./sync.js";
import createSerialTests from "./serialize.js";

describe("Isolation", () => {
	it("Starts at 0", () => {
		const counter = new GCounter({ id: "test" });

		expect(counter.toValue()).toBe(0);
	});

	it("Adds integers", () => {
		const counter = new GCounter({ id: "test" });
		const integers = [1, 100, 53];
		const sum = integers.reduce((p, c) => p + c, 0);

		for (const integer of integers) {
			counter.increment(integer);
		}

		expect(counter.toValue()).toBe(sum);
	});

	it("Adds floats", () => {
		const counter = new GCounter({ id: "test" });
		const floats = [1, 100.23, 53.000001, 0.12];
		const sum = floats.reduce((p, c) => p + c, 0);

		for (const float of floats) {
			counter.increment(float);
		}

		expect(counter.toValue()).toBe(sum);
	});

	it("Does not use negative values", () => {
		const counter = new GCounter({ id: "test" });
		const integers = [1, -2, 100,  -3, 53];
		const sum = integers.filter(i => i > 0).reduce((p, c) => p + c, 0);

		for (const integer of integers) {
			counter.increment(integer);
		}

		expect(counter.toValue()).toBe(sum);
	});
});

describe("Broadcast", () => {
	it("Broadcasts every time it increments", () => {
		const broadcast = jest.fn();
		const counter = new GCounter({ id: "test" });
		const times = 5;

		counter.addBroadcaster(broadcast);

		for (let i = 0; i < times; i++) {
			counter.increment(1);
		}

		expect(broadcast).toBeCalledTimes(times);
	});

	it("Does not broadcast when 0 or a negative value is passed", () => {
		const broadcast = jest.fn();
		const counter = new GCounter({ id: "test" });
		const values = [0, -1, -100];

		counter.addBroadcaster(broadcast);

		for (const value of values) {
			counter.increment(value);
		}

		expect(broadcast).not.toBeCalled();
	});
});

describe("Synchronizing", () => {
	createSyncTests(
		(id: string) => new GCounter({ id }),
		(crdt: GCounter, index: number) => crdt.increment(index + 1)
	);
});

describe("Serialization", () => {
	createSerialTests(
		(id: string) => new GCounter({ id }),
		(crdt: GCounter, index: number) => crdt.increment(index + 1),
		deserializeGCounter
	);
});
