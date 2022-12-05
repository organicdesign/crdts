import { LWWRegister } from "../src/LWWRegister.js";
import createSyncTests from "./sync.js";

const generateTimestamp = (() => {
	let last = 0;

	return () => (++last).toString(16);
})();

describe("Synchronizing", () => {
	createSyncTests(
		"register",
		(id: string) => new LWWRegister({ id, generateTimestamp }),
		(crdt: LWWRegister<unknown>, index: number) => crdt.set(`item-${index}`)
	);
});
