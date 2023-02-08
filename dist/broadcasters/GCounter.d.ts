import type { CRDTBroadcaster, CreateBroadcaster } from "@organicdesign/crdt-interfaces";
export type GCounterBroadcasterComponents = {
    onChange(watcher: (peer: Uint8Array, count: number) => void): void;
    set(peer: Uint8Array, count: number): void;
};
export interface GCounterBroadcasterOpts {
    protocol: string;
    listenOnly: boolean;
}
export declare class GCounterBroadcaster implements CRDTBroadcaster {
    private readonly components;
    private readonly config;
    private broadcast;
    constructor(components: GCounterBroadcasterComponents, options?: Partial<GCounterBroadcasterOpts>);
    get protocol(): string;
    onBroadcast(data: Uint8Array): void;
    setBroadcast(broadcast: (data: Uint8Array) => void): void;
    private onChange;
}
export declare const createGCounterBroadcaster: (options?: Partial<GCounterBroadcasterOpts>) => CreateBroadcaster<GCounterBroadcasterComponents, GCounterBroadcaster>;
