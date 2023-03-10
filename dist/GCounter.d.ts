import type { CompleteCRDT, CRDTConfig, MCounter } from "@organicdesign/crdt-interfaces";
import { BufferMap } from "@organicdesign/buffer-collections";
import { CRDT } from "./CRDT.js";
import { GCounterSyncComponents as SyncComps } from "./synchronizers/GCounter.js";
import { GCounterSerializerComponents as SerialComps } from "./serializers/GCounter.js";
import { GCounterBroadcasterComponents as BroadComps } from "./broadcasters/GCounter.js";
export interface GCounterConfig extends CRDTConfig<SyncComps, BroadComps, SerialComps> {
}
export interface GCounterOpts {
    dp: number;
}
export declare class GCounter extends CRDT<SyncComps & BroadComps & SerialComps> implements CompleteCRDT, MCounter {
    protected readonly data: BufferMap<number>;
    protected readonly options: GCounterOpts;
    protected readonly watchers: Map<string, (peer: Uint8Array, count: number) => void>;
    constructor(config: GCounterConfig, options?: Partial<GCounterOpts>);
    protected change(peer: Uint8Array, count: number): void;
    start(): void;
    toValue(): number;
    increment(quantity: number): void;
    protected update(value: number): void;
    protected round(count: number): number;
    private compareSelf;
}
export declare const createGCounter: (config: GCounterConfig, options?: Partial<GCounterOpts>) => GCounter;
