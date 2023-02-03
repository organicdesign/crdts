import type {
	SynchronizableCRDT,
	SerializableCRDT,
	BroadcastableCRDT,
	CRDTConfig,
	MCounter,
	CreateCRDT,
	CreateSynchronizer,
	CreateSerializer,
	CreateBroadcaster,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster
} from "../../crdt-interfaces/src/index.js";
import { BufferMap } from "@organicdesign/buffer-collections";
import { CRDT } from "./CRDT.js";
import { createGCounterSynchronizer } from "./synchronizers/GCounter.js";
import { createGCounterSerializer } from "./serializers/GCounter.js";
import { createGCounterBroadcaster } from "./broadcasters/GCounter.js";

export interface GCounterOpts {
	dp: number
}

export class GCounter extends CRDT implements SynchronizableCRDT, SerializableCRDT, BroadcastableCRDT, MCounter {
	protected readonly data = new BufferMap<number>();
	protected readonly dp: number = 10;
	protected readonly watchers: Map<string, (peer: Uint8Array, count: number) => void>;

	constructor (config: CRDTConfig, options: Partial<GCounterOpts> = {}) {
		config.synchronizers = config.synchronizers ?? [createGCounterSynchronizer()] as Iterable<CreateSynchronizer<CRDTSynchronizer>>;
		config.serializers = config.serializers ?? [createGCounterSerializer()] as Iterable<CreateSerializer<CRDTSerializer>>;
		config.broadcasters = config.broadcasters ?? [createGCounterBroadcaster()] as Iterable<CreateBroadcaster<CRDTBroadcaster>>;

		const watchers = new Map<string, (peer: Uint8Array, count: number) => void>();

		super(config, () => ({
			getPeers: () => this.data.keys(),
			get: (peer: Uint8Array) => this.data.get(peer) ?? 0,

			set: (peer: Uint8Array, count: number) => {
				const existing = this.data.get(peer) ?? 0;

				if (existing < count) {
					this.data.set(peer, count);
				}
			},

			onChange: (method: (peer: Uint8Array, count: number) => void) => {
				watchers.set(Math.random().toString(), method);
			}
		}));

		if (options?.dp) {
			this.dp = options.dp;
		}

		this.watchers = watchers;
	}

	protected change (peer: Uint8Array, count: number) {
		for (const watcher of this.watchers.values()) {
			watcher(peer, count);
		}
	}

	toValue(): number {
		return this.round([...this.data.values()].reduce((p, c) => p + c, 0));
	}

	increment(quantity: number): void {
		if (quantity < 0) {
			return;
		}

		const cValue = this.data.get(this.id) ?? 0;
		const nValue = cValue + quantity;

		this.update(nValue);
	}

	protected update (value: number) {
		if (this.compareSelf(this.id, value)) {
			this.data.set(this.id, value);

			this.change(this.id, value);
		}
	}

	protected round (count: number) {
		return Number(count.toFixed(this.dp));
	}

	// Returns true if the value passed is larger than the one stored.
	private compareSelf (key: Uint8Array, value: number) {
		return value > (this.data.get(key) ?? 0);
	}
}

export const createGCounter: CreateCRDT<GCounter> = (config: CRDTConfig, options: Partial<GCounterOpts> = {}) => new GCounter(config, options);
