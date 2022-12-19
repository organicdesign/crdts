import type { CRDT as ICRDT, Register, CRDTConfig } from "crdt-interfaces";
import { CRDT } from "./CRDT.js";
export declare class LWWRegister<T> extends CRDT implements ICRDT, Register<T> {
    private data;
    private timestamp;
    get(): T | undefined;
    set(value: T): void;
    clear(): void;
    sync(data?: Uint8Array): Uint8Array | undefined;
    toValue(): T | undefined;
    serialize(): Uint8Array;
    onBroadcast(data: Uint8Array): void;
}
export declare const createLWWRegister: <T>(config: CRDTConfig) => LWWRegister<T>;
