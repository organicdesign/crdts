import type { CRDTSerializer, SerializableCRDT } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export interface PNCounterSerializerComponents {
	getPCounter (): SerializableCRDT
	getNCounter (): SerializableCRDT
}

export interface PNCounterSyncOpts {
	protocol: string
	subProtocol: string
}

export class PNCounterSerializer implements CRDTSerializer {
	private readonly components: PNCounterSerializerComponents;
	private readonly options: PNCounterSyncOpts;

	constructor(components: PNCounterSerializerComponents, options: Partial<PNCounterSyncOpts> = {}) {
		this.options = {
			protocol: options.protocol ?? "/pn-counter/cbor/0.1.0",
			subProtocol: options.subProtocol ?? "/g-counter/cbor/0.1.0"
		};

		this.components = components;
	}

	get protocol () {
		return this.options.protocol;
	}

	serialize (): Uint8Array {
		return cborg.encode({
			pData: this.components.getPCounter().getSerializer(this.options.subProtocol)?.serialize(),
			nData: this.components.getNCounter().getSerializer(this.options.subProtocol)?.serialize()
		});
	}

	deserialize (data: Uint8Array) {
		const { pData, nData } = cborg.decode(data) as { pData: Uint8Array, nData: Uint8Array };

		this.components.getPCounter().getSerializer(this.options.subProtocol)?.deserialize(pData);
		this.components.getNCounter().getSerializer(this.options.subProtocol)?.deserialize(nData);
	}
}

export const createPNCounterSerializer = (options?: Partial<PNCounterSyncOpts>) => (components: PNCounterSerializerComponents) => new PNCounterSerializer(components, options);
