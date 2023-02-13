import type {
	CRDTConfig,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster,
	CompleteCRDT
} from "@organicdesign/crdt-interfaces";

type UMap = Record<string, unknown>

export class CRDT<
	Components extends UMap = {}
> implements Omit<CompleteCRDT, "toValue" | "start"> {
	protected readonly config: CRDTConfig<Components, Components, Components>;
	protected synchronizers: CRDTSynchronizer[] = [];
	protected serializers: CRDTSerializer[] = [];
	protected broadcasters: CRDTBroadcaster[] = [];
	protected started = false;

	constructor (config: CRDTConfig<Components, Components, Components>) {
		this.config = config;
	}

	protected setup (components: Components) {
		if (this.isStarted()) {
			return;
		}

		for (const createSynchronizer of this.config.synchronizers ?? []) {
			this.synchronizers.push(createSynchronizer(components));
		}

		for (const createSerializer of this.config.serializers ?? []) {
			this.serializers.push(createSerializer(components));
		}

		for (const createBroadcaster of this.config.broadcasters ?? []) {
			this.broadcasters.push(createBroadcaster(components));
		}

		this.started = true;
	}

	protected get generateTimestamp () {
		return this.config.generateTimestamp ?? Date.now;
	}

	isStarted () {
		return this.started;
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
