export interface CRDT {
	sync (data?: Uint8Array): Uint8Array | undefined
	toValue (): unknown
  serialize (): Uint8Array
  onBroadcast? (data: Uint8Array): void
  addBroadcaster? (broadcaster: (data: Uint8Array) => void): void
}

export interface CRDTConfig {
	id: string
  generateTimestamp?: () => string
}

export type deserialize = <T extends CRDT=CRDT>(data: Uint8Array) => T;

export interface GCounter {
  increment (quantity: number): void
}

export interface PNCounter extends GCounter {
  decrement (quantity: number): void
}

export interface Register<T> {
  get (): T
  set (value: T): void
}

export type GMap<T extends CRDT=CRDT> = Omit<Map<string, T>, "clear" | "delete" | typeof Symbol.toStringTag>;
export type PNMap<T> = Omit<Map<string, T>, typeof Symbol.toStringTag>;

export type GSet<T> = Omit<Set<T>, "clear" | "delete" | typeof Symbol.toStringTag>;
export type PNSet<T> = Omit<Set<T>, typeof Symbol.toStringTag>;
