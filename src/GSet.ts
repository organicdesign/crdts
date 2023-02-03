import type {
	SynchronizableCRDT,
	SerializableCRDT,
	BroadcastableCRDT,
	CRDTConfig,
	CreateSynchronizer,
	CreateSerializer,
	CreateBroadcaster,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster
} from "../../crdt-interfaces/src/index.js";
import { CRDT } from "./CRDT.js";
import { createGSetSynchronizer } from "./synchronizers/GSet.js";
import { createGSetSerializer } from "./serializers/GSet.js";
import { createGSetBroadcaster } from "./broadcasters/GSet.js";

export class GSet<T=unknown> extends CRDT implements SynchronizableCRDT, SerializableCRDT, BroadcastableCRDT, GSet<T> {
	private data = new Set<T>();
	protected readonly watchers: Map<string, (item: T) => void>;

	constructor (config: CRDTConfig) {
		config.synchronizers = config.synchronizers ?? [createGSetSynchronizer()] as Iterable<CreateSynchronizer<CRDTSynchronizer>>;
		config.serializers = config.serializers ?? [createGSetSerializer()] as Iterable<CreateSerializer<CRDTSerializer>>;
		config.broadcasters = config.broadcasters ?? [createGSetBroadcaster()] as Iterable<CreateBroadcaster<CRDTBroadcaster>>;

		const watchers = new Map<string, (item: T) => void>();

		super(config, () => ({
			get: () => this.data,
			add: (item: T) => this.data.add(item),

			onChange: (method: (item: T) => void) => {
				watchers.set(Math.random().toString(), method);
			}
		}));

		this.watchers = watchers;
	}

	protected change (item: T) {
		for (const watcher of this.watchers.values()) {
			watcher(item);
		}
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

export const createGSet = <T>(config: CRDTConfig) => new GSet<T>(config);
