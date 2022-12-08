import { CRDT as CRDTClass } from "./CRDT.js";
import type { CRDT, CRDTConfig } from "crdt-interfaces";
export declare class StateCRDT<T> extends CRDTClass implements Omit<CRDT, "toValue"> {
    protected readonly data: Map<string, T>;
    private readonly compare;
    private readonly defaultValue?;
    constructor(config: CRDTConfig, compare: (a: T, b: T) => boolean, defaultValue?: T);
    sync(data?: Uint8Array): Uint8Array | undefined;
    serialize(): Uint8Array;
    private createSyncObj;
    protected update(value: T): void;
    onBroadcast(data: Uint8Array): void;
    private compareSelf;
}
