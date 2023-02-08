import type { CRDTSerializer, CreateSerializer } from "@organicdesign/crdt-interfaces";
export type GCounterSerializerComponents = {
    get(peer: Uint8Array): number;
    getPeers(): Iterable<Uint8Array>;
    set(peer: Uint8Array, count: number): void;
};
export interface GCounterSerializerOpts {
    protocol: string;
}
export declare class GCounterSerializer implements CRDTSerializer {
    readonly protocol: string;
    private readonly components;
    constructor(components: GCounterSerializerComponents, options?: Partial<GCounterSerializerOpts>);
    serialize(): Uint8Array;
    deserialize(data: Uint8Array): void;
}
export declare const createGCounterSerializer: (options?: Partial<GCounterSerializerOpts>) => CreateSerializer<GCounterSerializerComponents, GCounterSerializer>;
