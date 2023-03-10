import type {
	CompleteCRDT,
	CRDTConfig,
	MCounter
} from "@organicdesign/crdt-interfaces";
import { BufferMap } from "@organicdesign/buffer-collections";
import { CRDT } from "./CRDT.js";
import { createGCounterSynchronizer, GCounterSyncComponents as SyncComps } from "./synchronizers/GCounter.js";
import { createGCounterSerializer, GCounterSerializerComponents as SerialComps } from "./serializers/GCounter.js";
import { createGCounterBroadcaster, GCounterBroadcasterComponents as BroadComps } from "./broadcasters/GCounter.js";

export interface GCounterConfig extends CRDTConfig<SyncComps, BroadComps, SerialComps> {};

export interface GCounterOpts {
	dp: number
}

export class GCounter extends CRDT<SyncComps & BroadComps & SerialComps> implements CompleteCRDT, MCounter {
	protected readonly data = new BufferMap<number>();
	protected readonly options: GCounterOpts;
	protected readonly watchers: Map<string, (peer: Uint8Array, count: number) => void>;

	constructor (config: GCounterConfig, options: Partial<GCounterOpts> = {}) {
		config.synchronizers = config.synchronizers ?? [createGCounterSynchronizer()];
		config.serializers = config.serializers ?? [createGCounterSerializer()];
		config.broadcasters = config.broadcasters ?? [createGCounterBroadcaster()];

		super(config);

		this.options = {
			dp: options.dp ?? 10
		};

		this.watchers = new Map<string, (peer: Uint8Array, count: number) => void>();
	}

	protected change (peer: Uint8Array, count: number) {
		for (const watcher of this.watchers.values()) {
			watcher(peer, count);
		}
	}

	start () {
		this.setup({
			getPeers: () => this.data.keys(),
			get: (peer: Uint8Array) => this.data.get(peer) ?? 0,

			set: (peer: Uint8Array, count: number) => {
				const existing = this.data.get(peer) ?? 0;

				if (existing < count) {
					this.data.set(peer, count);
				}
			},

			onChange: (method: (peer: Uint8Array, count: number) => void) => {
				this.watchers.set(Math.random().toString(), method);
			}
		});
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
		return Number(count.toFixed(this.options.dp));
	}

	// Returns true if the value passed is larger than the one stored.
	private compareSelf (key: Uint8Array, value: number) {
		return value > (this.data.get(key) ?? 0);
	}
}

export const createGCounter =
	(config: GCounterConfig, options: Partial<GCounterOpts> = {}) =>
		new GCounter(config, options);
