import type { CRDTBroadcaster, CreateBroadcaster } from "@organicdesign/crdt-interfaces";
export type LWWRegisterBroadcasterComponents = {
    onChange(watcher: (value: unknown, physical: number, logical: number, id: Uint8Array) => void): void;
    set(value: unknown, physical: number, logical: number, id: Uint8Array): void;
};
export interface LWWRegisterBroadcasterOpts {
    protocol: string;
    listenOnly: boolean;
}
export declare class LWWRegisterBroadcaster implements CRDTBroadcaster {
    private readonly components;
    private readonly config;
    private broadcast;
    constructor(components: LWWRegisterBroadcasterComponents, options?: Partial<LWWRegisterBroadcasterOpts>);
    get protocol(): string;
    onBroadcast(data: Uint8Array): void;
    setBroadcast(broadcast: (data: Uint8Array) => void): void;
    private onChange;
}
export declare const createLWWRegisterBroadcaster: (options?: Partial<LWWRegisterBroadcasterOpts>) => CreateBroadcaster<LWWRegisterBroadcasterComponents, LWWRegisterBroadcaster>;
