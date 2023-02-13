import type {
	CompleteCRDT,
	CRDTConfig
} from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { createGSetSynchronizer, GSetSyncComponents as SyncComps } from "./synchronizers/GSet.js";
import { createGSetSerializer, GSetSerializerComponents as SerialComps } from "./serializers/GSet.js";
import { createGSetBroadcaster, GSetBroadcasterComponents as BroadComps } from "./broadcasters/GSet.js";

export interface GSetConfig extends CRDTConfig<SyncComps, BroadComps, SerialComps> {}

export class GSet<T=unknown> extends CRDT<SyncComps & BroadComps & SerialComps> implements CompleteCRDT, GSet<T> {
	private data = new Set<T>();
	protected readonly watchers: Map<string, (item: T) => void>;

	constructor (config: GSetConfig) {
		config.synchronizers = config.synchronizers ?? [createGSetSynchronizer()];
		config.serializers = config.serializers ?? [createGSetSerializer()];
		config.broadcasters = config.broadcasters ?? [createGSetBroadcaster()];

		super(config);

		this.watchers = new Map<string, (item: T) => void>();
	}

	protected change (item: T) {
		for (const watcher of this.watchers.values()) {
			watcher(item);
		}
	}

	start () {
		this.setup({
			get: () => this.data,
			add: (item: T) => this.data.add(item),

			onChange: (method: (item: T) => void) => {
				this.watchers.set(Math.random().toString(), method);
			}
		});
	}

	[Symbol.iterator](): IterableIterator<T> {
		return this.data[Symbol.iterator]();
	}

	add(value: T): Set<T> {
		this.data.add(value);
		this.change(value);

		return this.toValue();
	}

	forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
		return this.data.forEach(callbackfn, thisArg);
	}

	has(value: T): boolean {
		return this.data.has(value);
	}

	get size(): number {
		return this.data.size;
	}

	entries(): IterableIterator<[T, T]> {
		return this.data.entries();
	}

	keys(): IterableIterator<T> {
		return this.data.keys();
	}

	values(): IterableIterator<T> {
		return this.data.values();
	}

	toValue(): Set<T> {
		return new Set(this.data);
	}
}

export const createGSet = <T>(config: GSetConfig) => new GSet<T>(config);
