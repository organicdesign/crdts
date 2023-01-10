import type { CRDT as ICRDT, CRDTConfig, MCounter, CreateCRDT } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { BufferMap } from "@organicdesign/buffer-collections";
export interface GCounterOpts {
    dp: number;
}
export declare class GCounter extends CRDT implements ICRDT, MCounter {
    protected readonly data: BufferMap<number>;
    protected readonly dp: number;
    constructor(config: CRDTConfig, options?: Partial<GCounterOpts>);
    sync(data?: Uint8Array): Uint8Array | undefined;
    serialize(): Uint8Array;
    deserialize(data: Uint8Array): void;
    onBroadcast(data: Uint8Array): void;
    toValue(): number;
    increment(quantity: number): void;
    protected update(value: number): void;
    protected round(count: number): number;
    private compareSelf;
}
export declare const createGCounter: CreateCRDT<GCounter>;
