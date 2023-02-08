import type { CRDTSynchronizer, CreateSynchronizer } from "@organicdesign/crdt-interfaces";
export type MVRegisterSyncComponents = {
    get(): {
        values: unknown[];
        logical: number;
    };
    set(values: unknown[], logical: number): void;
};
export interface MVRegisterSyncOpts {
    protocol: string;
}
export declare class MVRegisterSynchronizer implements CRDTSynchronizer {
    readonly protocol: string;
    private readonly components;
    constructor(components: MVRegisterSyncComponents, options?: Partial<MVRegisterSyncOpts>);
    sync(data?: Uint8Array): Uint8Array | undefined;
}
export declare const createMVRegisterSynchronizer: (options?: Partial<MVRegisterSyncOpts>) => CreateSynchronizer<MVRegisterSyncComponents, MVRegisterSynchronizer>;
