import createCRDTTests from "./crdt.js";
import type { GSet, CRDT, Deserialize } from "../src/interfaces.js";

export default (create: (id: string) => GSet<unknown> & CRDT, deserialize?: Deserialize<GSet<unknown> & CRDT> ) => {
  createCRDTTests(
    create,
    (crdt: GSet<unknown> & CRDT, index: number) => crdt.add(index + 1),
    deserialize
  );
};
