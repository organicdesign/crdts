import type {
	CompleteCRDT,
	CRDTConfig,
	BCounter,
	CreateCRDT
} from "@organicdesign/crdt-interfaces";
import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
import { createPNCounterSynchronizer, PNCounterSyncComponents as SyncComps } from "./synchronizers/PNCounter.js";
import { createPNCounterSerializer, PNCounterSerializerComponents as SerialComps } from "./serializers/PNCounter.js";
import { createPNCounterBroadcaster, PNCounterBroadcasterComponents as BroadComps } from "./broadcasters/PNCounter.js";

export interface PNCounterOpts {
	dp: number
}

export class PNCounter extends CRDT<SyncComps, BroadComps, SerialComps> implements CompleteCRDT, BCounter {
	private pCounter: GCounter;
	private nCounter: GCounter;

	constructor (config: CRDTConfig<SyncComps, BroadComps, SerialComps>, options: Partial<PNCounterOpts> = {}) {
		config.synchronizers = config.synchronizers ?? [createPNCounterSynchronizer()];
		config.serializers = config.serializers ?? [createPNCounterSerializer()];
		config.broadcasters = config.broadcasters ?? [createPNCounterBroadcaster()];

		if (options.dp == null) {
			options.dp = 10;
		}

		super(config);

		this.pCounter = new GCounter({ id: config.id }, options);
		this.nCounter = new GCounter({ id: config.id }, options);

		this.setup({
			getPCounter: () => this.pCounter,
			getNCounter: () => this.nCounter
		});
	}

	start () {
		this.pCounter.start();
		this.nCounter.start();

		super.start();
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

export const createPNCounter: CreateCRDT<PNCounter> =
	(config: CRDTConfig<SyncComps, BroadComps, SerialComps>) => new PNCounter(config);
