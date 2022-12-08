import type { CRDT as ICRDT, MSet, CRDTConfig } from "crdt-interfaces";
import { CRDT } from "./CRDT.js";
export declare class GSet<T = unknown> extends CRDT implements ICRDT, MSet<T> {
    private data;
    [Symbol.iterator](): IterableIterator<T>;
    add(value: T): Set<T>;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    get size(): number;
    entries(): IterableIterator<[T, T]>;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    sync(data?: Uint8Array): Uint8Array | undefined;
    toValue(): Set<T>;
    serialize(): Uint8Array;
    onBroadcast(data: Uint8Array): void;
}
export declare const createGSet: <T>(config: CRDTConfig) => GSet<T>;
