import type { CRDT as ICRDT, MVRegister as IMVRegister, CRDTConfig } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
export declare class MVRegister<T> extends CRDT implements ICRDT, IMVRegister<T> {
    private data;
    private logical;
    get(): T[];
    set(value: T): void;
    clear(): void;
    sync(data: Uint8Array | undefined): Uint8Array | undefined;
    toValue(): T[];
    serialize(): Uint8Array;
    onBroadcast(data: Uint8Array): void;
}
export declare const createMVRegister: <T>(config: CRDTConfig) => MVRegister<T>;
