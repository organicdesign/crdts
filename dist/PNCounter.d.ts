import type { CompleteCRDT, CRDTConfig, BCounter, CreateCRDT } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { PNCounterSyncComponents as SyncComps } from "./synchronizers/PNCounter.js";
import { PNCounterSerializerComponents as SerialComps } from "./serializers/PNCounter.js";
import { PNCounterBroadcasterComponents as BroadComps } from "./broadcasters/PNCounter.js";
export interface PNCounterOpts {
    dp: number;
}
export declare class PNCounter extends CRDT<SyncComps, BroadComps, SerialComps> implements CompleteCRDT, BCounter {
    private pCounter;
    private nCounter;
    constructor(config: CRDTConfig<SyncComps, BroadComps, SerialComps>, options?: Partial<PNCounterOpts>);
    start(): void;
    toValue(): number;
    increment(quantity: number): void;
    decrement(quantity: number): void;
}
export declare const createPNCounter: CreateCRDT<PNCounter>;
