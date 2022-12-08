import { CRDT } from "./CRDT.js";
import type { CRDT as ICRDT, CRDTConfig } from "crdt-interfaces";
export declare class MultiCRDT<T extends ICRDT = ICRDT> extends CRDT implements ICRDT {
    protected data: Map<string, T>;
    private create;
    constructor(config: CRDTConfig, create?: () => T);
    protected assign(key: string, crdt: T): void;
    get size(): number;
    keys(): IterableIterator<string>;
    sync(data?: Uint8Array): Uint8Array | undefined;
    toValue(): Map<string, unknown>;
    serialize(): Uint8Array;
    onBroadcast(data: Uint8Array): void;
}
