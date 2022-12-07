import createCRDTTests from "./crdt.js";
import type { MSet, CRDT, Deserialize } from "../src/interfaces.js";

export default (
  create: (id: string) => MSet<unknown> & CRDT,
  deserialize?: Deserialize<MSet<unknown> & CRDT>
) => {
  createCRDTTests(
    create,
    (crdt: MSet<unknown> & CRDT, index: number) => crdt.add(index + 1),
    deserialize
  );
};
