import type { CRDTSerializer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export interface GCounterSerializerComponents {
	getCount (peer: Uint8Array): number
	getPeers (): Iterable<Uint8Array>
	setCount (peer: Uint8Array, count: number): void
}

export interface GCounterSyncOpts {
	protocol: string
}

export class GCounterSerializer implements CRDTSerializer {
	public readonly protocol: string;
	private readonly components: GCounterSerializerComponents;

	constructor(components: GCounterSerializerComponents, options: Partial<GCounterSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/g-counter/cbor/0.1.0";
		this.components = components;
	}

	serialize (): Uint8Array {
		const data: { id: Uint8Array, count: number }[] = [];

		const peers = this.components.getPeers();

		for (const id of peers) {
			data.push({ id, count: this.components.getCount(id) });
		}

		return cborg.encode(data);
	}

	deserialize (data: Uint8Array) {
		const decoded = cborg.decode(data) as { id: Uint8Array, count: number }[];

		for (const { id, count } of decoded) {
			this.components.setCount(id, count);
		}
	}
}

export const createGCounterSerializer = (options?: Partial<GCounterSyncOpts>) => (components: GCounterSerializerComponents) => new GCounterSerializer(components, options);
