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
	protected synchronizers: CRDTSynchronizer[] = [];
	protected serializers: CRDTSerializer[] = [];
	protected broadcasters: CRDTBroadcaster[] = [];
	protected started = false;
	private components: SyncComps & BroadComps & SerialComps;

	constructor (config: CRDTConfig<SyncComps, BroadComps, SerialComps>) {
		this.config = config;
	}

	protected setup (components: SyncComps & BroadComps & SerialComps) {
		this.components = components;
	}

	protected get generateTimestamp () {
		return this.config.generateTimestamp ?? Date.now;
	}

	isStarted () {
		return this.started;
	}

	start () {
		if (this.components == null) {
			throw new Error("CRDT has not defined any components");
		}

		if (this.isStarted()) {
			return;
		}

		for (const createSynchronizer of this.config.synchronizers ?? []) {
			this.synchronizers.push(createSynchronizer(this.components));
		}

		for (const createSerializer of this.config.serializers ?? []) {
			this.serializers.push(createSerializer(this.components));
		}

		for (const createBroadcaster of this.config.broadcasters ?? []) {
			this.broadcasters.push(createBroadcaster(this.components));
		}

		this.started = true;
	}

	stop () {
		this.started = false;
		this.synchronizers = [];
		this.serializers = [];
		this.broadcasters = [];
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
