import type { SynchronizableCRDT, CRDTConfig, BMap, CreateCRDT } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { LWWRegister, LWWRegisterConfig } from "./LWWRegister.js";
import { LWWMapSyncComponents as SyncComps } from "./synchronizers/LWWMap.js";
export interface LWWMapConfig extends CRDTConfig<SyncComps> {
}
export interface LWWMapOpts<T> {
    createLWWRegister: CreateCRDT<LWWRegister<T>, LWWRegisterConfig>;
}
export declare class LWWMap<T> extends CRDT<SyncComps> implements SynchronizableCRDT, BMap<T> {
    protected data: Map<string, LWWRegister<T>>;
    protected readonly options: LWWMapOpts<T>;
    [Symbol.iterator](): IterableIterator<[string, T]>;
    constructor(config: CRDTConfig<SyncComps>, settings?: Partial<LWWMapOpts<T>>);
    protected assign(key: string, register: LWWRegister<T>): void;
    start(): void;
    get size(): number;
    keys(): IterableIterator<string>;
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
export declare const createLWWMap: <T>(config: LWWMapConfig, settings?: Partial<LWWMapOpts<T>> | undefined) => LWWMap<T>;
