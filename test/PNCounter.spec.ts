import { PNCounter } from "../src/PNCounter.js";
import createSyncTests from "./sync.js";

describe("Isolation", () => {
	it("Starts at 0", () => {
		const counter = new PNCounter({ id: "test" });

		expect(counter.toValue()).toBe(0);
	});

	it("Adds integers", () => {
		const counter = new PNCounter({ id: "test" });
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
		const counter = new PNCounter({ id: "test" });
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
		expect(Math.floor(counter.toValue() * 10000) / 10000).toBe(Math.floor(sum * 10000) / 10000);
	});
});

describe("Broadcast", () => {
	it("Broadcasts every time it increments", () => {
		const broadcast = jest.fn();
		const counter = new PNCounter({ id: "test" });
		const times = 5;

		counter.addBroadcaster(broadcast);

		for (let i = 0; i < times; i++) {
			counter.increment(1);
		}

		expect(broadcast).toBeCalledTimes(times);
	});

	it("Does not broadcast when 0 or a negative value is passed", () => {
		const broadcast = jest.fn();
		const counter = new PNCounter({ id: "test" });
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
		"counter",
		(id: string) => new PNCounter({ id }),
		(crdt: PNCounter, index: number) => index % 2 === 0 ? crdt.increment(index + 1) : crdt.decrement(index + 1)
	);
});
