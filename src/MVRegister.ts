import type {
	SynchronizableCRDT,
	SerializableCRDT,
	BroadcastableCRDT,
	CRDTConfig,
	MVRegister as IMVRegister,
	CreateSynchronizer,
	CreateSerializer,
	CreateBroadcaster,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster
} from "../../crdt-interfaces/src/index.js";
import { CRDT } from "./CRDT.js";
import { createMVRegisterSynchronizer } from "./synchronizers/MVRegister.js";
import { createMVRegisterSerializer } from "./serializers/MVRegister.js";
import { createMVRegisterBroadcaster } from "./broadcasters/MVRegister.js";

export class MVRegister<T> extends CRDT implements SynchronizableCRDT, SerializableCRDT, BroadcastableCRDT, IMVRegister<T> {
	private data = new Set<T>();
	private logical: number = 0;
	protected readonly watchers: Map<string, (values: unknown[], logical: number) => void>;

	constructor (config: CRDTConfig) {
		config.synchronizers = config.synchronizers ?? [createMVRegisterSynchronizer()] as Iterable<CreateSynchronizer<CRDTSynchronizer>>;
		config.serializers = config.serializers ?? [createMVRegisterSerializer()] as Iterable<CreateSerializer<CRDTSerializer>>;
		config.broadcasters = config.broadcasters ?? [createMVRegisterBroadcaster()] as Iterable<CreateBroadcaster<CRDTBroadcaster>>;

		super(config);

		this.watchers = new Map<string, (values: unknown[], logical: number) => void>();

		this.setup({
			get: () => ({
				values: [...this.data],
				logical: this.logical
			}),

			set: (values: unknown[], logical: number) => {
				if (logical === this.logical) {
					for (const value of values) {
						this.data.add(value as T);
					}
				} else {
					this.data = new Set(values as T[]);
					this.logical = logical;
				}
			},

			onChange: (method: (values: unknown[], logical: number) => void) => {
				this.watchers.set(Math.random().toString(), method);
			}
		});
	}

	protected change (values: unknown[], logical: number) {
		for (const watcher of this.watchers.values()) {
			watcher(values, logical);
		}
	}

	get(): T[] {
		return [...this.data];
	}

	set(value: T): void {
		this.data = new Set<T>([ value ]);
		this.logical++;

		this.change([value], this.logical);
	}

	clear(): void {
		this.data = new Set<T>();
		this.logical++;

		this.change([undefined], this.logical);
	}

	toValue(): T[] {
		return [...this.data].sort();
	}
}

export const createMVRegister = <T>(config: CRDTConfig) => new MVRegister<T>(config);
