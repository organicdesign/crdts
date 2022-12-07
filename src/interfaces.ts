export interface CRDT {
	sync (data?: Uint8Array): Uint8Array | undefined
	toValue (): unknown
  serialize? (): Uint8Array
  onBroadcast? (data: Uint8Array): void
  addBroadcaster? (broadcaster: (data: Uint8Array) => void): void
}

export interface CRDTConfig {
	id: string
  generateTimestamp?: () => string
}

export type CreateCRDT<T extends CRDT=CRDT> = (config: CRDTConfig) => T;

export type Deserialize<T extends CRDT=CRDT> = (data: Uint8Array) => T;

export interface MCounter {
  increment (quantity: number): void
}

export interface BCounter extends MCounter {
  decrement (quantity: number): void
}

export interface Register<T> {
  get (): T | undefined
  set (value: T): void
  clear (): void
}

export interface MVRegister<T> {
	get (): T[] | undefined
	set (value: T): void
	clear (): void
}

export type MMap<T> = Omit<Map<string, T>, "clear" | "delete" | typeof Symbol.toStringTag>;
export type BMap<T> = Omit<Map<string, T>, typeof Symbol.toStringTag>;

export type MSet<T> = Omit<Set<T>, "clear" | "delete" | typeof Symbol.toStringTag>;
export type BSet<T> = Omit<Set<T>, typeof Symbol.toStringTag>;
