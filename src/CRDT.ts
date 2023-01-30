import type {
	CRDTConfig,
	CRDTSynchronizer,
	CRDTSerializer,
	CRDTBroadcaster,
	CRDT as ICRDT,
	SerializableCRDT,
	SynchronizableCRDT,
	BroadcastableCRDT
} from "@organicdesign/crdt-interfaces";

export class CRDT implements Omit<ICRDT & SerializableCRDT & SynchronizableCRDT & BroadcastableCRDT, "toValue"> {
	protected readonly config: CRDTConfig;
	protected readonly synchronizers: CRDTSynchronizer[] = [];
	protected readonly serializers: CRDTSerializer[] = [];
	protected readonly broadcasters: CRDTBroadcaster[] = [];

	constructor (config: CRDTConfig) {
		this.config = config;
	}

	get id () : Uint8Array {
		return this.config.id;
	}

	protected get generateTimestamp () {
		return this.config.generateTimestamp ?? Date.now;
	}

	getSynchronizer (protocol: string): CRDTSynchronizer | undefined {
		return this.synchronizers.find(s => s.protocol === protocol);
	}

	getSynchronizerProtocols (): Iterable<string> {
		return this.synchronizers.map(s => s.protocol);
	}

	getSerializer (protocol: string): CRDTSerializer | undefined {
		return this.serializers.find(s => s.protocol === protocol);
	}

	getSerializeProtocols (): Iterable<string> {
		return this.serializers.map(s => s.protocol);
	}

	getBroadcaster (protocol: string): CRDTBroadcaster | undefined {
		return this.broadcasters.find(s => s.protocol === protocol);
	}

	getBroadcastProtocols (): Iterable<string> {
		return this.broadcasters.map(s => s.protocol);
	}
}
