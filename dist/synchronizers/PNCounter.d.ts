import { CRDTSynchronizer, SynchronizableCRDT, SyncContext, CreateSynchronizer } from "@organicdesign/crdt-interfaces";
export type PNCounterSyncComponents = {
    getPCounter(): SynchronizableCRDT;
    getNCounter(): SynchronizableCRDT;
};
export interface PNCounterSyncOpts {
    protocol: string;
    subProtocol: string;
}
export declare class PNCounterSynchronizer implements CRDTSynchronizer {
    private readonly components;
    private readonly options;
    constructor(components: PNCounterSyncComponents, options?: Partial<PNCounterSyncOpts>);
    get protocol(): string;
    sync(data: Uint8Array | undefined, context: SyncContext): Uint8Array | undefined;
}
export declare const createPNCounterSynchronizer: (options?: Partial<PNCounterSyncOpts>) => CreateSynchronizer<PNCounterSyncComponents, PNCounterSynchronizer>;
