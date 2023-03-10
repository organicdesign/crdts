import type { CRDTSynchronizer, CreateSynchronizer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export type GCounterSyncComponents = {
	get (peer: Uint8Array): number
	set (peer: Uint8Array, count: number): void
	getPeers (): Iterable<Uint8Array>
}

export interface GCounterSyncOpts {
	protocol: string
}

export class GCounterSynchronizer implements CRDTSynchronizer {
	public readonly protocol: string;
	private readonly components: GCounterSyncComponents;

	constructor(components: GCounterSyncComponents, options: Partial<GCounterSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/g-counter/cbor/0.1.0";
		this.components = components;
	}

	sync (data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			const response: { id: Uint8Array, count: number }[] = [];

			for (const peer of this.components.getPeers()) {
				response.push({
					id: peer,
					count: this.components.get(peer)
				});
			}

			return cborg.encode(response);
		}

		const counts: { id: Uint8Array, count: number }[] = cborg.decode(data) as { id: Uint8Array, count: number }[];

		for (const iCount of counts) {
			const { id, count } = iCount;

			if (count != null) {
				this.components.set(id, count);
			}
		}
	}
}

export const createGCounterSynchronizer =
	(options?: Partial<GCounterSyncOpts>): CreateSynchronizer<GCounterSyncComponents, GCounterSynchronizer> =>
		(components: GCounterSyncComponents) => new GCounterSynchronizer(components, options);
