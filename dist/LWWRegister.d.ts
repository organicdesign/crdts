import type { CRDT as ICRDT, BRegister, CRDTConfig, SyncContext } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
export declare class LWWRegister<T> extends CRDT implements ICRDT, BRegister<T> {
    private data;
    private timestamp;
    private lastId;
    get(): T | undefined;
    set(value: T): void;
    clear(): void;
    sync(data: Uint8Array | undefined, { id }: SyncContext): Uint8Array | undefined;
    toValue(): T | undefined;
    serialize(): Uint8Array;
    onBroadcast(data: Uint8Array): void;
    private update;
}
export declare const createLWWRegister: <T>(config: CRDTConfig) => LWWRegister<T>;
