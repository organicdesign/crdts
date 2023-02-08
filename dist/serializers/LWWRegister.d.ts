import type { CRDTSerializer, CreateSerializer } from "@organicdesign/crdt-interfaces";
export type LWWRegisterSerializerComponents = {
    get(): {
        value: unknown;
        physical: number;
        logical: number;
        id: Uint8Array;
    };
    set(value: unknown, physical: number, logical: number, id: Uint8Array): void;
};
export interface LWWRegisterSerializerOpts {
    protocol: string;
}
export declare class LWWRegisterSerializer implements CRDTSerializer {
    readonly protocol: string;
    private readonly components;
    constructor(components: LWWRegisterSerializerComponents, options?: Partial<LWWRegisterSerializerOpts>);
    serialize(): Uint8Array;
    deserialize(data: Uint8Array): void;
}
export declare const createLWWRegisterSerializer: (options?: Partial<LWWRegisterSerializerOpts>) => CreateSerializer<LWWRegisterSerializerComponents, LWWRegisterSerializer>;
