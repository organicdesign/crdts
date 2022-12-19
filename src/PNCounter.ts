import * as cborg from "cborg";
import { CRDT as ICRDT, CRDTConfig, BCounter, CreateCRDT } from "crdt-interfaces";
import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";

export class PNCounter extends CRDT implements ICRDT, BCounter {
	private pCounter: GCounter;
	private nCounter: GCounter;

	constructor(config: CRDTConfig) {
		super(config);

		this.pCounter = new GCounter(config);
		this.nCounter = new GCounter(config);

		this.pCounter.addBroadcaster((pData: Uint8Array) => this.broadcast(
			cborg.encode({ pData })
		));

		this.nCounter.addBroadcaster((nData: Uint8Array) => this.broadcast(
			cborg.encode({ nData })
		));
	}

	sync(data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			const pData = this.pCounter.sync();
			const nData = this.nCounter.sync();

			const syncObj: { pData?: Uint8Array, nData?: Uint8Array } = {};

			if (pData != null) {
				syncObj.pData = pData;
			}

			if (nData != null) {
				syncObj.nData = nData;
			}

			return cborg.encode(syncObj);
		}

		const { pData, nData }: { pData?: Uint8Array, nData?: Uint8Array } = cborg.decode(data);
		const syncObj: { pData?: Uint8Array, nData?: Uint8Array } = {};

		if (pData != null) {
			syncObj.pData = this.pCounter.sync(pData);
		}

		if (nData != null) {
			syncObj.nData = this.nCounter.sync(nData);
		}

		if (pData == null && nData == null) {
			return;
		}

		return cborg.encode(syncObj);
	}

	serialize(): Uint8Array {
		return cborg.encode({
			pData: this.pCounter.serialize(),
			nData: this.nCounter.serialize()
		});
	}

	onBroadcast(data: Uint8Array): void {
		const { pData, nData } = cborg.decode(data);

		if (pData != null) {
			this.pCounter.onBroadcast(pData);
		}

		if (nData != null) {
			this.nCounter.onBroadcast(nData);
		}
	}

	toValue(): number {
		return this.pCounter.toValue() - this.nCounter.toValue();
	}

	increment(quantity: number): void {
		this.pCounter.increment(quantity);
	}

	decrement(quantity: number): void {
		this.nCounter.increment(quantity);
	}
}

export const createPNCounter: CreateCRDT<PNCounter> = (config: CRDTConfig) => new PNCounter(config);
