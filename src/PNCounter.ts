import type {
	CompleteCRDT,
	CRDTConfig,
	BCounter,
	CreateCRDT
} from "@organicdesign/crdt-interfaces";
import { GCounter, GCounterConfig, createGCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
import { createPNCounterSynchronizer, PNCounterSyncComponents as SyncComps } from "./synchronizers/PNCounter.js";
import { createPNCounterSerializer, PNCounterSerializerComponents as SerialComps } from "./serializers/PNCounter.js";
import { createPNCounterBroadcaster, PNCounterBroadcasterComponents as BroadComps } from "./broadcasters/PNCounter.js";

export interface PNCounterConfig extends CRDTConfig<SyncComps, BroadComps, SerialComps> {}

export interface PNCounterOpts {
	dp: number
	createGCounter: CreateCRDT<GCounter, GCounterConfig>
}

export class PNCounter extends CRDT<SyncComps & BroadComps & SerialComps> implements CompleteCRDT, BCounter {
	private pCounter: GCounter;
	private nCounter: GCounter;
	protected readonly options: PNCounterOpts;

	constructor (config: PNCounterConfig, options: Partial<PNCounterOpts> = {}) {
		config.synchronizers = config.synchronizers ?? [createPNCounterSynchronizer()];
		config.serializers = config.serializers ?? [createPNCounterSerializer()];
		config.broadcasters = config.broadcasters ?? [createPNCounterBroadcaster()];

		super(config);

		this.options = {
			dp: options.dp ?? 10,
			createGCounter: options.createGCounter ?? createGCounter
		};

		this.pCounter = this.options.createGCounter({ id: config.id }, { dp: this.options.dp });
		this.nCounter = this.options.createGCounter({ id: config.id }, { dp: this.options.dp });
	}

	start () {
		this.pCounter.start();
		this.nCounter.start();

		this.setup({
			getPCounter: () => this.pCounter,
			getNCounter: () => this.nCounter
		});
	}

	toValue(): number {
		return this.pCounter.toValue() - this.nCounter.toValue();
	}

	increment(quantity: number): void {
		this.pCounter.increment(quantity);
	}

	decrement(quantity: number): void {
		this.nCounter.increment(quantity);
	}
}

export const createPNCounter =
	(config: PNCounterConfig, options?: Partial<PNCounterOpts>) => new PNCounter(config, options);
