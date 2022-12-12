import type { CRDT as ICRDT, MMap, CRDTConfig } from "crdt-interfaces";
import { MultiCRDT } from "./MultiCRDT.js";

export class CRDTMap<T extends ICRDT=ICRDT> extends MultiCRDT<T> implements ICRDT, MMap<ICRDT> {
	protected data = new Map<string, T>();

	constructor (config: CRDTConfig) {
		super(config);
	}

	[Symbol.iterator](): IterableIterator<[string, T]> {
		return this.data[Symbol.iterator]();
	}

	forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void {
		return this.data.forEach(callbackfn, thisArg);
	}

	get(key: string): T | undefined {
		return this.data.get(key);
	}

	has(key: string): boolean {
		return this.data.has(key);
	}

	set(key: string, value: T): Map<string, T> {
		this.assign(key, value);

		return new Map(this.data.set(key, value));
	}

	entries(): IterableIterator<[string, T]> {
		return this.data.entries();
	}

	values(): IterableIterator<T> {
		return this.data.values();
	}
}


export const createCRDTMap = <T extends ICRDT=ICRDT>(config: CRDTConfig) => new CRDTMap<T>(config);
