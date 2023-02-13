import type { CompleteCRDT, CRDTConfig, MVRegister as IMVRegister } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { MVRegisterSyncComponents as SyncComps } from "./synchronizers/MVRegister.js";
import { MVRegisterSerializerComponents as SerialComps } from "./serializers/MVRegister.js";
import { MVRegisterBroadcasterComponents as BroadComps } from "./broadcasters/MVRegister.js";
export interface MVRegisterConfig extends CRDTConfig<SyncComps, BroadComps, SerialComps> {
}
export declare class MVRegister<T> extends CRDT<SyncComps & BroadComps & SerialComps> implements CompleteCRDT, IMVRegister<T> {
    private data;
    private logical;
    protected readonly watchers: Map<string, (values: unknown[], logical: number) => void>;
    constructor(config: MVRegisterConfig);
    protected change(values: unknown[], logical: number): void;
    start(): void;
    get(): T[];
    set(value: T): void;
    clear(): void;
    toValue(): T[];
}
export declare const createMVRegister: <T>(config: MVRegisterConfig) => MVRegister<T>;
