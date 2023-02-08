import type { CRDTSynchronizer, CreateSynchronizer } from "@organicdesign/crdt-interfaces";
export type GCounterSyncComponents = {
    get(peer: Uint8Array): number;
    set(peer: Uint8Array, count: number): void;
    getPeers(): Iterable<Uint8Array>;
};
export interface GCounterSyncOpts {
    protocol: string;
}
export declare class GCounterSynchronizer implements CRDTSynchronizer {
    readonly protocol: string;
    private readonly components;
    constructor(components: GCounterSyncComponents, options?: Partial<GCounterSyncOpts>);
    sync(data?: Uint8Array): Uint8Array | undefined;
}
export declare const createGCounterSynchronizer: (options?: Partial<GCounterSyncOpts>) => CreateSynchronizer<GCounterSyncComponents, GCounterSynchronizer>;
