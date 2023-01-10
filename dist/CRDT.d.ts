import type { CRDTConfig } from "@organicdesign/crdt-interfaces";
export declare class CRDT {
    protected readonly config: CRDTConfig;
    private readonly broadcasters;
    constructor(config: CRDTConfig);
    addBroadcaster(broadcaster: (data: Uint8Array) => void): void;
    get id(): Uint8Array;
    protected get generateTimestamp(): () => string;
    protected broadcast(data: Uint8Array): void;
}
