import type { CRDTSynchronizer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export interface GSetSyncComponents {
	get (): Iterable<unknown>
	add (item: unknown): void
}

export interface GSetSyncOpts {
	protocol: string
}

export class GSetSynchronizer implements CRDTSynchronizer {
	public readonly protocol: string;
	private readonly components: GSetSyncComponents;

	constructor(components: GSetSyncComponents, options: Partial<GSetSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/g-set/cbor/0.1.0";
		this.components = components;
	}

	sync (data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return cborg.encode([...this.components.get()]);
		}

		const items = cborg.decode(data) as unknown[];

		for (const item of items) {
			this.components.add(item);
		}
	}
}

export const createGSetSynchronizer = (options?: Partial<GSetSyncOpts>) => (components: GSetSyncComponents) => new GSetSynchronizer(components, options);
