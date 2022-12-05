import { GSet } from "../src/GSet.js";
import { createSyncTests } from "./utils.js";

describe("Synchronizing", () => {
	createSyncTests(
		"counter",
		(id: string) => new GSet({ id }),
		(crdt: GSet<unknown>, index: number) => crdt.add(`item-${index}`),
		true
	);
});
