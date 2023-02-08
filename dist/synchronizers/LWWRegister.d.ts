import type { CRDTSynchronizer, SyncContext, CreateSynchronizer } from "@organicdesign/crdt-interfaces";
export type LWWRegisterSyncComponents = {
    get(): {
        value: unknown;
        physical: number;
        logical: number;
        id: Uint8Array;
    };
    set(value: unknown, physical: number, logical: number, id: Uint8Array): void;
};
export interface LWWRegisterSyncOpts {
    protocol: string;
}
export declare class LWWRegisterSynchronizer implements CRDTSynchronizer {
    readonly protocol: string;
    private readonly components;
    constructor(components: LWWRegisterSyncComponents, options?: Partial<LWWRegisterSyncOpts>);
    sync(data: Uint8Array | undefined, { id }: SyncContext): Uint8Array | undefined;
}
export declare const createLWWRegisterSynchronizer: (options?: Partial<LWWRegisterSyncOpts>) => CreateSynchronizer<LWWRegisterSyncComponents, LWWRegisterSynchronizer>;
