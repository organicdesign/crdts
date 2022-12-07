import createCRDTTests from "./crdt.js";
import type { BMap, CRDT, Deserialize } from "../src/interfaces.js";

export default (
	create: (id: string) => BMap<unknown> & CRDT,
	deserialize?: Deserialize<BMap<unknown> & CRDT>
) => {
	createCRDTTests(
		create,
		(crdt: BMap<unknown> & CRDT, index: number) => crdt.set((index % 5).toString(), index + 1),
		deserialize
	);
};
