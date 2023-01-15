# CRDTs

A group of useful CRDTs implementing interfaces from `@organicdesign/crdt-interfaces`.

## Install

```
npm i @organicdesign/crdts
```

## CRDTs

Each CRDT exposes a class, an instantiation method and if applicable, a deserialize method. Most of these CRDTs use a basic protocol encoded in CBOR and have room for improvement in regards to efficiency and specification.

```javascript
// 'createCRDT' is a placeholder for a specific CRDT creation method.
const crdt = createCRDT({ id: new Uint8Array([1]) });

const syncData = crdt.sync(remoteSyncData);

console.log(crdt.toValue());
```

If you are using these CRDTs with Libp2p you should use the peer ID as the CRDT id:

```javascript
createCRDT({ id: libp2p.peerId.toBytes() });
```

### G-Counter

```javascript
import { createGCounter } from "@organicdesign/crdts";

const counter = createGCounter({ id: new Uint8Array([123]) });

counter.increment(1);

console.log(counter.toValue()); // 1
```

A grow only counter.

### PN-Counter

```javascript
import { createPNCounter } from "@organicdesign/crdts";

const counter = createPNCounter({ id: new Uint8Array([123]) });

counter.increment(5);
counter.decrement(2);

console.log(counter.toValue()); // 3
```

A positive/negative counter (one that can grow and shrink).

### G-Set

```javascript
import { createGSet } from "@organicdesign/crdts";

const set = createGSet({ id: new Uint8Array([123]) });

// Do anything you can do with a native Set.
set.add("value-1");

console.log(set.toValue()); // Set [ "value-1" ]
```

A grow only set.

### MV-Register
```javascript
import { createMVRegister } from "@organicdesign/crdts";

const register = createMVRegister({ id: new Uint8Array([123]) });

register.set("value-1");

console.log(register.toValue()); // [ "value-1" ]
```

A multi-value register. This register relies on logical time only and will return an array with all values that are set at the same time.

### LWW-Register

```javascript
import { createLWWRegister } from "@organicdesign/crdts";

const register = createLWWRegister({ id: new Uint8Array([123]) });

register.set("value-1");

console.log(register.toValue()); // "value-1"
```

A last write wins register. Uses hybrid time and IDs to ensure consistency.

### LWW-Map

```javascript
import { createLWWMap } from "@organicdesign/crdts";

const map = createLWWMap({ id: new Uint8Array([123]) });

// Do anything you can do with a Map
map.set("key-1", "value-1");

console.log(map.toValue()); // Map { "key-1" → "value-1" }
```

A last write wins map. Uses hybrid time and IDs to ensure consistency.

### CRDT-Map

```javascript
import { createCRDTMap, createGCounter } from "@organicdesign/crdts";

const map = createCRDTMap({ id: new Uint8Array([123]) });
const counter = createGCounter({ id: new Uint8Array([123]) });

map.set("key-1", counter);
counter.increment(1);

console.log(map.toValue()); // Map { "key-1" → 1 }
```

A map containing only CRDTs as it's values. You will need to ensure each instance of this type has the same structure of values.

## Building

To build the project files run:

```sh
npm run build
```

## Testing

To run the tests:

```sh
npm run test
```

To lint files:

```sh
npm run lint
```
