import type { CRDTSerializer, CreateSerializer } from "@organicdesign/crdt-interfaces";
export type MVRegisterSerializerComponents = {
    get(): {
        values: unknown[];
        logical: number;
    };
    set(values: unknown[], logical: number): void;
};
export interface MVRegisterSerializerOpts {
    protocol: string;
}
export declare class MVRegisterSerializer implements CRDTSerializer {
    readonly protocol: string;
    private readonly components;
    constructor(components: MVRegisterSerializerComponents, options?: Partial<MVRegisterSerializerOpts>);
    serialize(): Uint8Array;
    deserialize(data: Uint8Array): void;
}
export declare const createMVRegisterSerializer: (options?: Partial<MVRegisterSerializerOpts>) => CreateSerializer<MVRegisterSerializerComponents, MVRegisterSerializer>;
