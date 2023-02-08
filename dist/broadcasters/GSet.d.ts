import type { CRDTBroadcaster, CreateBroadcaster } from "@organicdesign/crdt-interfaces";
export type GSetBroadcasterComponents = {
    onChange(watcher: (item: unknown) => void): void;
    add(item: unknown): void;
};
export interface GSetBroadcasterOpts {
    protocol: string;
    listenOnly: boolean;
}
export declare class GSetBroadcaster implements CRDTBroadcaster {
    private readonly components;
    private readonly config;
    private broadcast;
    constructor(components: GSetBroadcasterComponents, options?: Partial<GSetBroadcasterOpts>);
    get protocol(): string;
    onBroadcast(data: Uint8Array): void;
    setBroadcast(broadcast: (data: Uint8Array) => void): void;
    private onChange;
}
export declare const createGSetBroadcaster: (options?: Partial<GSetBroadcasterOpts>) => CreateBroadcaster<GSetBroadcasterComponents, GSetBroadcaster>;
