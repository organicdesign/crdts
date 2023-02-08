import type { CRDTBroadcaster, CreateBroadcaster } from "@organicdesign/crdt-interfaces";
export type MVRegisterBroadcasterComponents = {
    onChange(watcher: (values: unknown[], logical: number) => void): void;
    set(values: unknown[], logical: number): void;
};
export interface MVRegisterBroadcasterOpts {
    protocol: string;
    listenOnly: boolean;
}
export declare class MVRegisterBroadcaster implements CRDTBroadcaster {
    private readonly components;
    private readonly config;
    private broadcast;
    constructor(components: MVRegisterBroadcasterComponents, options?: Partial<MVRegisterBroadcasterOpts>);
    get protocol(): string;
    onBroadcast(data: Uint8Array): void;
    setBroadcast(broadcast: (data: Uint8Array) => void): void;
    private onChange;
}
export declare const createMVRegisterBroadcaster: (options?: Partial<MVRegisterBroadcasterOpts>) => CreateBroadcaster<MVRegisterBroadcasterComponents, MVRegisterBroadcaster>;
