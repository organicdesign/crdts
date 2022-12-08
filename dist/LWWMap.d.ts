import { MultiCRDT } from "./MultiCRDT.js";
import { LWWRegister } from "./LWWRegister.js";
import type { CRDT as ICRDT, BMap, CRDTConfig } from "crdt-interfaces";
export declare class LWWMap<T> extends MultiCRDT<LWWRegister<T>> implements ICRDT, BMap<T> {
    [Symbol.iterator](): IterableIterator<[string, T]>;
    constructor(config: CRDTConfig);
    clear(): void;
    delete(key: string): boolean;
    forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void;
    get(key: string): T | undefined;
    has(key: string): boolean;
    set(key: string, value: T): Map<string, T>;
    entries(): IterableIterator<[string, T]>;
    values(): IterableIterator<T>;
    toValue(): Map<string, T>;
}
export declare const createLWWMap: <T>(config: CRDTConfig) => LWWMap<T>;
