import type { CRDTSynchronizer, SynchronizableCRDT, SyncContext } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export interface PNCounterSyncComponents {
	getPCounter (): SynchronizableCRDT
	getNCounter (): SynchronizableCRDT
}

export interface PNCounterSyncOpts {
	protocol: string
	subProtocol: string
}

export class PNCounterSynchronizer implements CRDTSynchronizer {
	private readonly components: PNCounterSyncComponents;
	private readonly options: PNCounterSyncOpts;

	constructor(components: PNCounterSyncComponents, options: Partial<PNCounterSyncOpts> = {}) {
		this.options = {
			protocol: options.protocol ?? "/pn-counter/cbor/0.1.0",
			subProtocol: options.subProtocol ?? "/g-counter/cbor/0.1.0"
		};

		this.components = components;
	}

	get protocol () {
		return this.options.protocol;
	}

	sync (data: Uint8Array | undefined, context: SyncContext): Uint8Array | undefined {
		if (data == null) {
			const pData = this.components.getPCounter().getSynchronizer(this.options.subProtocol)?.sync(undefined, context);
			const nData = this.components.getNCounter().getSynchronizer(this.options.subProtocol)?.sync(undefined, context);

			const syncObj: { pData?: Uint8Array, nData?: Uint8Array } = {};

			if (pData != null) {
				syncObj.pData = pData;
			}

			if (nData != null) {
				syncObj.nData = nData;
			}

			return cborg.encode(syncObj);
		}

		const { pData, nData } = cborg.decode(data) as { pData?: Uint8Array, nData?: Uint8Array };
		const syncObj: { pData?: Uint8Array, nData?: Uint8Array } = {};

		if (pData != null) {
			syncObj.pData = this.components.getPCounter().getSynchronizer(this.options.subProtocol)?.sync(pData, context);
		}

		if (nData != null) {
			syncObj.nData = this.components.getNCounter().getSynchronizer(this.options.subProtocol)?.sync(nData, context);
		}

		if (pData == null && nData == null) {
			return;
		}

		return cborg.encode(syncObj);
	}
}

export const createPNCounterSynchronizer = (options?: Partial<PNCounterSyncOpts>) => (components: PNCounterSyncComponents) => new PNCounterSynchronizer(components, options);
