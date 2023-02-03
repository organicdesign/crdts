import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import type {
	SynchronizableCRDT,
	SerializableCRDT,
	BroadcastableCRDT,
	CRDTConfig,
	BRegister,
	CreateSynchronizer,
	CreateSerializer,
	CreateBroadcaster,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster
} from "../../crdt-interfaces/src/index.js";
import { CRDT } from "./CRDT.js";
import { createLWWRegisterSynchronizer } from "./synchronizers/LWWRegister.js";
import { createLWWRegisterSerializer } from "./serializers/LWWRegister.js";
import { createLWWRegisterBroadcaster } from "./broadcasters/LWWRegister.js";

export class LWWRegister<T> extends CRDT implements SynchronizableCRDT, SerializableCRDT, BroadcastableCRDT, BRegister<T> {
	private data: T | undefined;
	private physical: number = 0;
	private logical: number = 0;
	private lastId: Uint8Array = new Uint8Array();
	protected readonly watchers: Map<string, (value: unknown, physical: number, logical: number, id: Uint8Array) => void>;

	constructor (config: CRDTConfig) {
		config.synchronizers = config.synchronizers ?? [createLWWRegisterSynchronizer()] as Iterable<CreateSynchronizer<CRDTSynchronizer>>;
		config.serializers = config.serializers ?? [createLWWRegisterSerializer()] as Iterable<CreateSerializer<CRDTSerializer>>;
		config.broadcasters = config.broadcasters ?? [createLWWRegisterBroadcaster()] as Iterable<CreateBroadcaster<CRDTBroadcaster>>;

		const watchers = new Map<string, (value: unknown, physical: number, logical: number, id: Uint8Array) => void>();

		super(config, () => ({
			get: () => ({
				value: this.data,
				physical: this.physical,
				logical: this.logical,
				id: this.lastId
			}),

			set: (value: unknown, physical: number, logical: number, id: Uint8Array) => {
				if (physical === this.physical && logical === this.logical) {
					// Timestamps happened at the same time, we need to decide what happened first.
					if (uint8ArrayToString(id) > uint8ArrayToString(this.lastId)) {
						this.data = value as T;
						this.lastId = id;
					}
				} else if (physical > this.physical || logical > this.logical) {
					this.data = value as T;
					this.physical = Math.max(physical, this.physical);
					this.logical = physical > this.physical ? 0 : logical;
					this.lastId = id;
				}
			},

			onChange: (method: (value: unknown, physical: number, logical: number, id: Uint8Array) => void) => {
				watchers.set(Math.random().toString(), method)
			}
		}));

		this.watchers = watchers;
	}

	protected change (value: unknown, physical: number, logical: number, id: Uint8Array) {
		for (const watcher of this.watchers.values()) {
			watcher(value, physical, logical, id);
		}
	}

	get(): T | undefined {
		return this.data;
	}

	set(value: T): void {
		const physical = this.generateTimestamp();

		this.data = value;
		this.logical = physical > this.physical ? 0 : this.logical + 1;
		this.physical = Math.max(physical, this.physical);
		this.lastId = this.id;

		this.change(
			value,
			this.physical,
			this.logical,
			this.id
		);
	}

	clear(): void {
		const physical = this.generateTimestamp();

		this.data = undefined;
		this.logical = physical > this.physical ? 0 : this.logical + 1;
		this.physical = Math.max(physical, this.physical);
		this.lastId = this.id;

		this.change(
			undefined,
			this.physical,
			this.logical,
			this.id
		);
	}

	toValue(): T | undefined {
		return this.data;
	}
}

export const createLWWRegister = <T>(config: CRDTConfig) => new LWWRegister<T>(config);
