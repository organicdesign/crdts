import * as cborg from "cborg";
import { GCounter } from "../src/GCounter.js";

const syncCounter = (counter1: GCounter, counter2: GCounter) => {
	let data = counter1.sync();
	let i = 0;

	while (data != null) {
		if (i > 100) {
			throw new Error("Infinite sync loop detected.");
		}

		const response = counter2.sync(data);

		if (response == null) {
			break;
		}

		data = counter1.sync(response);

		i++;
	}
};

const syncCounters = (counters: GCounter[]) => {
	for (const counter1 of counters) {
		for (const counter2 of counters) {
			if (counter1 === counter2) {
				continue;
			}

			syncCounter(counter1, counter2);
		}
	}
};

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
	it("Syncs 2 counters", () => {
		const counters = [
			new GCounter({ id: "test-1" }),
			new GCounter({ id: "test-2" })
		];

		counters[0].increment(12);
		counters[1].increment(18);

		syncCounters(counters);

		expect(counters[0].toValue()).toBe(30);
		expect(counters[1].toValue()).toBe(30);
	});

	it("Syncs n counters", () => {
		const numberOfCounters = 20;
		const counters: GCounter[] = [];
		const sum = numberOfCounters * (numberOfCounters + 1) / 2;

		for (let i = 1; i <= numberOfCounters; i++) {
			const counter = new GCounter({ id: `test-${i}` });

			counter.increment(i);

			counters.push(counter);
		}

		syncCounters(counters);

		for (const counter of counters) {
			expect(counter.toValue()).toBe(sum);
		}
	});

	it("Syncs 2 counters over broadcast", () => {
		const numberOfCounters = 2;
		const counters: GCounter[] = [];

		const createBroadcast = (counter: GCounter) => (data: Uint8Array) => {
			for (const rCounter of counters) {
				// Don't broadcast to self.
				if (rCounter === counter) {
					continue;
				}

				rCounter.onBroadcast(data);
			}
		};

		for (let i = 1; i <= numberOfCounters; i++) {
			let counterRef: {counter?: GCounter} = {};
			const counter = new GCounter({ id: `test-${i}` });

			counter.addBroadcaster(createBroadcast(counter));

			counters.push(counter);
		}

		counters[0].increment(12);
		counters[1].increment(18);

		expect(counters[0].toValue()).toBe(30);
		expect(counters[1].toValue()).toBe(30);
	});

	it("Syncs n counters over broadcast", () => {
		const numberOfCounters = 20;
		const counters: GCounter[] = [];
		const sum = numberOfCounters * (numberOfCounters + 1) / 2;

		const createBroadcast = (counter: GCounter) => (data: Uint8Array) => {
			for (const rCounter of counters) {
				// Don't broadcast to self.
				if (rCounter === counter) {
					continue;
				}

				rCounter.onBroadcast(data);
			}
		};

		for (let i = 1; i <= numberOfCounters; i++) {
			const counter = new GCounter({ id: `test-${i}` });

			counter.addBroadcaster(createBroadcast(counter));

			counters.push(counter);
		}

		for (let i = 0; i < counters.length; i++) {
			counters[i].increment(i + 1);
		}

		for (const counter of counters) {
			expect(counter.toValue()).toBe(sum);
		}
	});
});
