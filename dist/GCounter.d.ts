import type { CRDT, CRDTConfig, MCounter, Deserialize, CreateCRDT } from "crdt-interfaces";
import { StateCRDT } from "./StateCRDT.js";
export declare class GCounter extends StateCRDT<number> implements CRDT, MCounter {
    constructor(config: CRDTConfig);
    toValue(): number;
    increment(quantity: number): void;
}
export declare const createGCounter: CreateCRDT<GCounter>;
export declare const deserializeGCounter: Deserialize<GCounter>;
