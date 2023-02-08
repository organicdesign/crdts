import { CRDTBroadcaster, BroadcastableCRDT, CreateBroadcaster } from "@organicdesign/crdt-interfaces";
export type PNCounterBroadcasterComponents = {
    getPCounter(): BroadcastableCRDT;
    getNCounter(): BroadcastableCRDT;
};
export interface PNCounterBroadcasterOpts {
    protocol: string;
    listenOnly: boolean;
    subProtocol: string;
}
export declare class PNCounterBroadcaster implements CRDTBroadcaster {
    private readonly components;
    private readonly options;
    private broadcast;
    constructor(components: PNCounterBroadcasterComponents, options?: Partial<PNCounterBroadcasterOpts>);
    get protocol(): string;
    onBroadcast(data: Uint8Array): void;
    setBroadcast(broadcast: (data: Uint8Array) => void): void;
    private onSubBroadcast;
}
export declare const createPNCounterBroadcaster: (options?: Partial<PNCounterBroadcasterOpts>) => CreateBroadcaster<PNCounterBroadcasterComponents, PNCounterBroadcaster>;
