import { CRDTSynchronizer, SynchronizableCRDT, SyncContext, CreateSynchronizer } from "@organicdesign/crdt-interfaces";
export type LWWMapSyncComponents = {
    keys(): Iterable<string>;
    get(key: string): SynchronizableCRDT | undefined;
};
export interface LWWMapSyncOpts {
    protocol: string;
    subProtocol: string;
}
export declare class LWWMapSynchronizer implements CRDTSynchronizer {
    private readonly components;
    private readonly options;
    constructor(components: LWWMapSyncComponents, options?: Partial<LWWMapSyncOpts>);
    get protocol(): string;
    sync(data: Uint8Array | undefined, context: SyncContext): Uint8Array | undefined;
}
export declare const createLWWMapSynchronizer: (options?: Partial<LWWMapSyncOpts>) => CreateSynchronizer<LWWMapSyncComponents, LWWMapSynchronizer>;
