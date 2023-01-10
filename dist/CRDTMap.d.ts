import type { CRDT as ICRDT, MMap, CRDTConfig } from "@organicdesign/crdt-interfaces";
import { MultiCRDT } from "./MultiCRDT.js";
export declare class CRDTMap<T extends ICRDT = ICRDT> extends MultiCRDT<T> implements ICRDT, MMap<ICRDT> {
    protected data: Map<string, T>;
    constructor(config: CRDTConfig);
    [Symbol.iterator](): IterableIterator<[string, T]>;
    forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void;
    get(key: string): T | undefined;
    has(key: string): boolean;
    set(key: string, value: T): Map<string, T>;
    entries(): IterableIterator<[string, T]>;
    values(): IterableIterator<T>;
}
export declare const createCRDTMap: <T extends ICRDT = ICRDT>(config: CRDTConfig) => CRDTMap<T>;
