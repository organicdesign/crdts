import type { CRDTConfig } from "crdt-interfaces";
export declare class CRDT {
    protected readonly config: CRDTConfig;
    private readonly broadcasters;
    constructor(config: CRDTConfig);
    addBroadcaster(broadcaster: (data: Uint8Array) => void): void;
    protected get id(): string;
    protected get generateTimestamp(): () => string;
    protected broadcast(data: Uint8Array): void;
}
