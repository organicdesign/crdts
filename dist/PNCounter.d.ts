import { CRDT as ICRDT, CRDTConfig, BCounter, CreateCRDT } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
export declare class PNCounter extends CRDT implements ICRDT, BCounter {
    private pCounter;
    private nCounter;
    constructor(config: CRDTConfig);
    sync(data?: Uint8Array): Uint8Array | undefined;
    serialize(): Uint8Array;
    onBroadcast(data: Uint8Array): void;
    toValue(): number;
    increment(quantity: number): void;
    decrement(quantity: number): void;
}
export declare const createPNCounter: CreateCRDT<PNCounter>;
