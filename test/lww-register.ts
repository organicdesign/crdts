import createCRDTTests from "./crdt.js";
import type { Register, CRDT, Deserialize } from "../src/interfaces.js";

export default (create: (id: string) => Register<unknown> & CRDT, deserialize?: Deserialize<Register<unknown> & CRDT> ) => {
	createCRDTTests(
		create,
		(crdt: Register<unknown> & CRDT, index: number) => crdt.set(index + 1),
		deserialize
	);
};
