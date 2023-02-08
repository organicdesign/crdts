import type { CRDTConfig, CRDTSynchronizer, CRDTSerializer, CRDTBroadcaster, CompleteCRDT } from "@organicdesign/crdt-interfaces";
type UMap = Record<string, unknown>;
export declare class CRDT<SyncComps extends UMap = {}, BroadComps extends UMap = {}, SerialComps extends UMap = {}> implements Omit<CompleteCRDT, "toValue"> {
    protected readonly config: CRDTConfig<SyncComps, BroadComps, SerialComps>;
    protected readonly synchronizers: CRDTSynchronizer[];
    protected readonly serializers: CRDTSerializer[];
    protected readonly broadcasters: CRDTBroadcaster[];
    constructor(config: CRDTConfig<SyncComps, BroadComps, SerialComps>);
    protected setup(components: SyncComps & BroadComps & SerialComps): void;
    protected get generateTimestamp(): () => number;
    get id(): Uint8Array;
    getSynchronizers(): Iterable<CRDTSynchronizer>;
    getSerializers(): Iterable<CRDTSerializer>;
    getBroadcasters(): Iterable<CRDTBroadcaster>;
}
export {};
