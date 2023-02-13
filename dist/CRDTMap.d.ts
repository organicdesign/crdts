import type { SynchronizableCRDT, CRDTConfig, MMap, CRDT as ICRDT } from "@organicdesign/crdt-interfaces";
import { CRDTMapSyncComponents as SyncComps } from "@organicdesign/crdt-map-synchronizer";
import { CRDT } from "./CRDT.js";
export interface GSetConfig extends CRDTConfig<SyncComps> {
}
export declare class CRDTMap<T extends ICRDT = ICRDT> extends CRDT<SyncComps> implements SynchronizableCRDT, MMap<T> {
    protected data: Map<string, T>;
    constructor(config: GSetConfig);
    protected assign(key: string, crdt: T): void;
    start(): void;
    [Symbol.iterator](): IterableIterator<[string, T]>;
    get size(): number;
    keys(): IterableIterator<string>;
    forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void;
    get(key: string): T | undefined;
    has(key: string): boolean;
    set(key: string, value: T): Map<string, T>;
    entries(): IterableIterator<[string, T]>;
    values(): IterableIterator<T>;
    toValue(): Map<string, unknown>;
}
export declare const createCRDTMap: <T extends ICRDT = ICRDT>(config: GSetConfig) => CRDTMap<T>;
