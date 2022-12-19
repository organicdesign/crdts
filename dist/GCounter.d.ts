import type { CRDT as ICRDT, MCounter, CreateCRDT } from "crdt-interfaces";
import { CRDT } from "./CRDT.js";
import BufferMap from "buffer-map";
export declare class GCounter extends CRDT implements ICRDT, MCounter {
    protected readonly data: BufferMap<number>;
    sync(data?: Uint8Array): Uint8Array | undefined;
    serialize(): Uint8Array;
    deserialize(data: Uint8Array): void;
    onBroadcast(data: Uint8Array): void;
    toValue(): number;
    increment(quantity: number): void;
    protected update(value: number): void;
    private compareSelf;
}
export declare const createGCounter: CreateCRDT<GCounter>;
