import createCRDTTests from "./crdt.js";
import type { PNMap, CRDT, Deserialize } from "../src/interfaces.js";

export default (create: (id: string) => PNMap<unknown> & CRDT, deserialize?: Deserialize<PNMap<unknown> & CRDT> ) => {
  createCRDTTests(
    create,
    (crdt: PNMap<unknown> & CRDT, index: number) => crdt.set((index % 5).toString(), index + 1),
    deserialize
  );
};
