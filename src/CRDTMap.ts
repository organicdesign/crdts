import type {
	SynchronizableCRDT,
	CRDTConfig,
	MMap,
	CRDT as ICRDT
} from "@organicdesign/crdt-interfaces";
import { createCRDTMapSynchronizer, CRDTMapSyncComponents as SyncComps } from "@organicdesign/crdt-map-synchronizer";
import { CRDT } from "./CRDT.js";

export class CRDTMap<T extends ICRDT=ICRDT> extends CRDT<SyncComps> implements SynchronizableCRDT, MMap<T> {
	protected data = new Map<string, T>();

	constructor (config: CRDTConfig<SyncComps>) {
		config.synchronizers = config.synchronizers ?? [createCRDTMapSynchronizer()];

		super(config);

		this.setup({
			keys: () => this.data.keys(),
			get: (key: string) => this.data.get(key),
			getId: () => this.id
		});

		// Disable serialization and broadcast.
		Object.defineProperties(this, {
			getSerializers: { value: undefined },
			getBroadcasters: { value: undefined }
		});
	}

	protected assign (key: string, crdt: T) {
		this.data.set(key, crdt);
	}

	[Symbol.iterator](): IterableIterator<[string, T]> {
		return this.data[Symbol.iterator]();
	}

	get size(): number {
		return this.data.size;
	}

	keys(): IterableIterator<string> {
		return this.data.keys();
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

	toValue(): Map<string, unknown> {
		const output = new Map<string, unknown>();

		for (const [key, crdt] of this.data.entries()) {
			output.set(key, crdt.toValue());
		}

		return output;
	}
}


export const createCRDTMap = <T extends ICRDT=ICRDT>(config: CRDTConfig<SyncComps>) => new CRDTMap<T>(config);
