import type { CompleteCRDT, CRDTConfig, BCounter, CreateCRDT } from "@organicdesign/crdt-interfaces";
import { GCounter, GCounterConfig } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
import { PNCounterSyncComponents as SyncComps } from "./synchronizers/PNCounter.js";
import { PNCounterSerializerComponents as SerialComps } from "./serializers/PNCounter.js";
import { PNCounterBroadcasterComponents as BroadComps } from "./broadcasters/PNCounter.js";
export interface PNCounterConfig extends CRDTConfig<SyncComps, BroadComps, SerialComps> {
}
export interface PNCounterOpts {
    dp: number;
    createGCounter: CreateCRDT<GCounter, GCounterConfig>;
}
export declare class PNCounter extends CRDT<SyncComps & BroadComps & SerialComps> implements CompleteCRDT, BCounter {
    private pCounter;
    private nCounter;
    protected readonly options: PNCounterOpts;
    constructor(config: PNCounterConfig, options?: Partial<PNCounterOpts>);
    start(): void;
    toValue(): number;
    increment(quantity: number): void;
    decrement(quantity: number): void;
}
export declare const createPNCounter: (config: PNCounterConfig, options?: Partial<PNCounterOpts>) => PNCounter;
