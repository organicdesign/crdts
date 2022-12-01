import { GCounter } from "../src/GCounter.js";

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
		const integers = [1, 100.23, 53.000001, 0.12];
		const sum = integers.reduce((p, c) => p + c, 0);

		for (const integer of integers) {
			counter.increment(integer);
		}

		expect(counter.toValue()).toBe(sum);
	});
});
