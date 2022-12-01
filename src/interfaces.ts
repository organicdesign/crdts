export interface CRDT {
	sync (data?: Uint8Array): Uint8Array
	toValue (): unknown
  serialize (): Uint8Array
}

export type deserialize = <T extends CRDT=CRDT>(data: Uint8Array) => T;

export interface GCounter {
  increment (quantity: number): void
}

export interface PNCounter extends GCounter {
  decrement (quantity: number): void
}

export interface Register<T=unknown> {
  get (): T
  set (value: T): void
}

export type GMap<T extends CRDT=CRDT> = Omit<Map<string, T>, "clear" | "delete" | typeof Symbol.toStringTag>;
export type PNMap<T=unknown> = Omit<Map<string, T>, typeof Symbol.toStringTag>;

export type GSet<T=unknown> = Omit<Set<T>, "clear" | "delete" | typeof Symbol.toStringTag>;
export type PNSet<T=unknown> = Omit<Set<T>, typeof Symbol.toStringTag>;
