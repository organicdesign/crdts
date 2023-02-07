import type {
	CRDTConfig,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster,
	CRDT as ICRDT,
	SerializableCRDT,
	SynchronizableCRDT,
	BroadcastableCRDT
} from "../../crdt-interfaces/src/index.js";

type AllCRDTTypes = ICRDT & SerializableCRDT & SynchronizableCRDT & BroadcastableCRDT;

export class CRDT implements Omit<AllCRDTTypes, "toValue"> {
	protected readonly config: CRDTConfig;
	protected readonly synchronizers: CRDTSynchronizer[] = [];
	protected readonly serializers: CRDTSerializer[] = [];
	protected readonly broadcasters: CRDTBroadcaster[] = [];

	constructor (config: CRDTConfig) {
		this.config = config;
	}

	protected setup (components: Record<string, unknown> = {}) {
		for (const createSynchronizer of this.config.synchronizers ?? []) {
			this.synchronizers.push(createSynchronizer(components));
		}

		for (const createSerializer of this.config.serializers ?? []) {
			this.serializers.push(createSerializer(components));
		}

		for (const createBroadcaster of this.config.broadcasters ?? []) {
			this.broadcasters.push(createBroadcaster(components));
		}
	}

	get id () : Uint8Array {
		return this.config.id;
	}

	protected get generateTimestamp () {
		return this.config.generateTimestamp ?? Date.now;
	}

	getSynchronizers (): Iterable<CRDTSynchronizer> {
		return this.synchronizers;
	}

	getSerializers (): Iterable<CRDTSerializer> {
		return this.serializers;
	}

	getBroadcasters (): Iterable<CRDTBroadcaster> {
		return this.broadcasters;
	}
}
