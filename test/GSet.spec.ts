import { GSet } from "../src/GSet.js";
import createSyncTests from "./sync.js";

describe("Synchronizing", () => {
	createSyncTests(
		(id: string) => new GSet({ id }),
		(crdt: GSet<unknown>, index: number) => crdt.add(`item-${index}`)
	);
});
