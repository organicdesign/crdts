import type { CompleteCRDT, CRDTConfig } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { GSetSyncComponents as SyncComps } from "./synchronizers/GSet.js";
import { GSetSerializerComponents as SerialComps } from "./serializers/GSet.js";
import { GSetBroadcasterComponents as BroadComps } from "./broadcasters/GSet.js";
export declare class GSet<T = unknown> extends CRDT<SyncComps, BroadComps, SerialComps> implements CompleteCRDT, GSet<T> {
    private data;
    protected readonly watchers: Map<string, (item: T) => void>;
    constructor(config: CRDTConfig<SyncComps, BroadComps, SerialComps>);
    protected change(item: T): void;
    [Symbol.iterator](): IterableIterator<T>;
    add(value: T): Set<T>;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    get size(): number;
    entries(): IterableIterator<[T, T]>;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    toValue(): Set<T>;
}
export declare const createGSet: <T>(config: CRDTConfig<SyncComps, BroadComps, SerialComps>) => GSet<T>;
