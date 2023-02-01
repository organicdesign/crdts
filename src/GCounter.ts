import type {
	SynchronizableCRDT,
	CRDTConfig,
	MCounter,
	CreateCRDT
} from "../../crdt-interfaces/src/index.js";
import { BufferMap } from "@organicdesign/buffer-collections";
import { CRDT } from "./CRDT.js";
import { createGCounterSynchronizer } from "./synchronizers/GCounter.js";
import { createGCounterSerializer } from "./serializers/GCounter.js";
import { createGCounterBroadcaster } from "./broadcasters/GCounter.js";

export interface GCounterOpts {
	dp: number
}

export class GCounter extends CRDT implements SynchronizableCRDT, MCounter {
	protected readonly data = new BufferMap<number>();
	protected readonly dp: number = 10;
	protected readonly watchers = new Map<string, (peer: Uint8Array, count: number) => void>();

	constructor (config: CRDTConfig, options: Partial<GCounterOpts> = {}) {
		super(config);

		if (options?.dp) {
			this.dp = options.dp;
		}

		for (const createSynchronizer of config.synchronizers ?? [createGCounterSynchronizer()]) {
			this.synchronizers.push(createSynchronizer(this.components));
		}

		for (const createSerializer of config.serializers ?? [createGCounterSerializer()]) {
			this.serializers.push(createSerializer(this.components));
		}

		for (const createBroadcaster of config.broadcasters ?? [createGCounterBroadcaster()]) {
			this.broadcasters.push(createBroadcaster(this.components));
		}
	}

	private get components () {
		return {
			getPeers: () => this.data.keys(),
			getCount: (peer: Uint8Array) => this.data.get(peer) ?? 0,

			setCount: (peer: Uint8Array, count: number) => {
				const existing = this.data.get(peer) ?? 0;

				if (existing < count) {
					this.data.set(peer, count);
				}
			},

			onChange: (method: (peer: Uint8Array, count: number) => void) => {
				this.watchers.set(Math.random().toString(), method)
			}
		}
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
