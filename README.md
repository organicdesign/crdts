# CRDTs

A group of useful CRDTs implementing interfaces from crdt-interfaces.

## CRDTs

Each CRDT exposes a class, a instantiation method and if applicable, a deserialize method.

### G-Counter

```javascript
import { createGCounter } from "crdts";
```

A grow only counter.

### PN-Counter

```javascript
import { createPNCounter } from "crdts";
```

A positive/negative counter (one that can grow and shrink).

### G-Set

```javascript
import { createGSet } from "crdts";
```

A grow only set.

### MV-Register
```javascript
import { createMVRegister } from "crdts";
```

A multi-value register. This register relies on logical time only and will return an array with all values that are set at the same time.

### LWW-Register

```javascript
import { createLWWRegister } from "crdts";
```

A last write wins register. Uses hybrid time and IDs to ensure consistency.

### LWW-Map

```javascript
import { createLWWMap } from "crdts";
```

A last write wins map. Uses hybrid time and IDs to ensure consistency.

### CRDT-Map

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
