import type {
	SynchronizableCRDT,
	SerializableCRDT,
	BroadcastableCRDT,
	CRDTConfig,
	BCounter,
	CreateCRDT
} from "../../crdt-interfaces/src/index.js";
import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
import { createPNCounterSynchronizer } from "./synchronizers/PNCounter.js";
import { createPNCounterSerializer } from "./serializers/PNCounter.js";
import { createPNCounterBroadcaster } from "./broadcasters/PNCounter.js";

export interface PNCounterOpts {
	dp: number
}

export class PNCounter extends CRDT implements SynchronizableCRDT, SerializableCRDT, BroadcastableCRDT, BCounter {
	private pCounter: GCounter;
	private nCounter: GCounter;

	constructor (config: CRDTConfig, options: Partial<PNCounterOpts> = {}) {
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

export const createPNCounter: CreateCRDT<PNCounter> = (config: CRDTConfig) => new PNCounter(config);
