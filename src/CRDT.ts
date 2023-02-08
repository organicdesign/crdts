import type {
	CRDTConfig,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster,
	CompleteCRDT
} from "@organicdesign/crdt-interfaces";

type UMap = Record<string, unknown>

export class CRDT<
	SyncComps extends UMap = {},
	BroadComps extends UMap = {},
	SerialComps extends UMap = {}
> implements Omit<CompleteCRDT, "toValue"> {
	protected readonly config: CRDTConfig<SyncComps, BroadComps, SerialComps>;
	protected readonly synchronizers: CRDTSynchronizer[] = [];
	protected readonly serializers: CRDTSerializer[] = [];
	protected readonly broadcasters: CRDTBroadcaster[] = [];

	constructor (config: CRDTConfig<SyncComps, BroadComps, SerialComps>) {
		this.config = config;
	}

	// Setup is separated from the constructor so that subclasses can access 'this' before setting up components.
	protected setup (components: SyncComps & BroadComps & SerialComps) {
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

	protected get generateTimestamp () {
		return this.config.generateTimestamp ?? Date.now;
	}

	get id () : Uint8Array {
		return this.config.id;
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
