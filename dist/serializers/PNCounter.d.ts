import { CRDTSerializer, SerializableCRDT, CreateSerializer } from "@organicdesign/crdt-interfaces";
export type PNCounterSerializerComponents = {
    getPCounter(): SerializableCRDT;
    getNCounter(): SerializableCRDT;
};
export interface PNCounterSerializerOpts {
    protocol: string;
    subProtocol: string;
}
export declare class PNCounterSerializer implements CRDTSerializer {
    private readonly components;
    private readonly options;
    constructor(components: PNCounterSerializerComponents, options?: Partial<PNCounterSerializerOpts>);
    get protocol(): string;
    serialize(): Uint8Array;
    deserialize(data: Uint8Array): void;
}
export declare const createPNCounterSerializer: (options?: Partial<PNCounterSerializerOpts>) => CreateSerializer<PNCounterSerializerComponents, PNCounterSerializer>;
