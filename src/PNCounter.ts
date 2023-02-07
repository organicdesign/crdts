import type {
	SynchronizableCRDT,
	SerializableCRDT,
	BroadcastableCRDT,
	CRDTConfig,
	BCounter,
	CreateCRDT,
	CreateSynchronizer,
	CreateSerializer,
	CreateBroadcaster,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster
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
		config.synchronizers = config.synchronizers ?? [createPNCounterSynchronizer()] as Iterable<CreateSynchronizer<CRDTSynchronizer>>;
		config.serializers = config.serializers ?? [createPNCounterSerializer()] as Iterable<CreateSerializer<CRDTSerializer>>;
		config.broadcasters = config.broadcasters ?? [createPNCounterBroadcaster()] as Iterable<CreateBroadcaster<CRDTBroadcaster>>;

		if (options.dp == null) {
			options.dp = 10;
		}

		const pCounter = new GCounter({ id: config.id }, options);
		const nCounter = new GCounter({ id: config.id }, options);

		super(config, {
			getPCounter: () => pCounter,
			getNCounter: () => nCounter
		});

		this.pCounter = pCounter;
		this.nCounter = nCounter;
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
