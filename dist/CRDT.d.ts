import type { CRDTConfig, CRDTSynchronizer, CRDTSerializer, CRDTBroadcaster, CompleteCRDT } from "@organicdesign/crdt-interfaces";
type UMap = Record<string, unknown>;
export declare class CRDT<Components extends UMap = {}> implements Omit<CompleteCRDT, "toValue" | "start"> {
    protected readonly config: CRDTConfig<Components, Components, Components>;
    protected synchronizers: CRDTSynchronizer[];
    protected serializers: CRDTSerializer[];
    protected broadcasters: CRDTBroadcaster[];
    protected started: boolean;
    constructor(config: CRDTConfig<Components, Components, Components>);
    protected setup(components: Components): void;
    protected get generateTimestamp(): () => number;
    isStarted(): boolean;
    stop(): void;
    get id(): Uint8Array;
    getSynchronizers(): Iterable<CRDTSynchronizer>;
    getSerializers(): Iterable<CRDTSerializer>;
    getBroadcasters(): Iterable<CRDTBroadcaster>;
}
export {};
