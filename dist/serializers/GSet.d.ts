import type { CRDTSerializer, CreateSerializer } from "@organicdesign/crdt-interfaces";
export type GSetSerializerComponents = {
    get(): Iterable<unknown>;
    add(item: unknown): void;
};
export interface GSetSerializerOpts {
    protocol: string;
}
export declare class GSetSerializer implements CRDTSerializer {
    readonly protocol: string;
    private readonly components;
    constructor(components: GSetSerializerComponents, options?: Partial<GSetSerializerOpts>);
    serialize(): Uint8Array;
    deserialize(data: Uint8Array): void;
}
export declare const createGSetSerializer: (options?: Partial<GSetSerializerOpts>) => CreateSerializer<GSetSerializerComponents, GSetSerializer>;
