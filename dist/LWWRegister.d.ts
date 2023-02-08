import type { CompleteCRDT, CRDTConfig, BRegister } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { LWWRegisterSyncComponents as SyncComps } from "./synchronizers/LWWRegister.js";
import { LWWRegisterSerializerComponents as SerialComps } from "./serializers/LWWRegister.js";
import { LWWRegisterBroadcasterComponents as BroadComps } from "./broadcasters/LWWRegister.js";
export declare class LWWRegister<T> extends CRDT<SyncComps, BroadComps, SerialComps> implements CompleteCRDT, BRegister<T> {
    private data;
    private physical;
    private logical;
    private lastId;
    protected readonly watchers: Map<string, (value: unknown, physical: number, logical: number, id: Uint8Array) => void>;
    constructor(config: CRDTConfig<SyncComps, BroadComps, SerialComps>);
    protected change(value: unknown, physical: number, logical: number, id: Uint8Array): void;
    get(): T | undefined;
    set(value: T): void;
    clear(): void;
    toValue(): T | undefined;
}
export declare const createLWWRegister: <T>(config: CRDTConfig<SyncComps, BroadComps, SerialComps>) => LWWRegister<T>;
