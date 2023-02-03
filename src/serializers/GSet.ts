import type { CRDTSerializer } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export interface GSetSerializerComponents {
	get (): Iterable<unknown>
	add (item: unknown): void
}

export interface GSetSyncOpts {
	protocol: string
}

export class GSetSerializer implements CRDTSerializer {
	public readonly protocol: string;
	private readonly components: GSetSerializerComponents;

	constructor(components: GSetSerializerComponents, options: Partial<GSetSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/g-set/cbor/0.1.0";
		this.components = components;
	}

	serialize (): Uint8Array {
		return cborg.encode([...this.components.get()]);
	}

	deserialize (data: Uint8Array) {
		const items = cborg.decode(data) as unknown[];

		for (const item of items) {
			this.components.add(item);
		}
	}
}

export const createGSetSerializer = (options?: Partial<GSetSyncOpts>) => (components: GSetSerializerComponents) => new GSetSerializer(components, options);
