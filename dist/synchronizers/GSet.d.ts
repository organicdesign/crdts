import type { CRDTSynchronizer, CreateSynchronizer } from "@organicdesign/crdt-interfaces";
export type GSetSyncComponents = {
    get(): Iterable<unknown>;
    add(item: unknown): void;
};
export interface GSetSyncOpts {
    protocol: string;
}
export declare class GSetSynchronizer implements CRDTSynchronizer {
    readonly protocol: string;
    private readonly components;
    constructor(components: GSetSyncComponents, options?: Partial<GSetSyncOpts>);
    sync(data?: Uint8Array): Uint8Array | undefined;
}
export declare const createGSetSynchronizer: (options?: Partial<GSetSyncOpts>) => CreateSynchronizer<GSetSyncComponents, GSetSynchronizer>;
