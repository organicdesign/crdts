export class CRDT {
    constructor(config) {
        this.synchronizers = [];
        this.serializers = [];
        this.broadcasters = [];
        this.started = false;
        this.config = config;
    }
    setup(components) {
        var _a, _b, _c;
        if (this.isStarted()) {
            return;
        }
        for (const createSynchronizer of (_a = this.config.synchronizers) !== null && _a !== void 0 ? _a : []) {
            this.synchronizers.push(createSynchronizer(components));
        }
        for (const createSerializer of (_b = this.config.serializers) !== null && _b !== void 0 ? _b : []) {
            this.serializers.push(createSerializer(components));
        }
        for (const createBroadcaster of (_c = this.config.broadcasters) !== null && _c !== void 0 ? _c : []) {
            this.broadcasters.push(createBroadcaster(components));
        }
        this.started = true;
    }
    get generateTimestamp() {
        var _a;
        return (_a = this.config.generateTimestamp) !== null && _a !== void 0 ? _a : Date.now;
    }
    isStarted() {
        return this.started;
    }
    stop() {
        this.started = false;
        this.synchronizers = [];
        this.serializers = [];
        this.broadcasters = [];
    }
    get id() {
        return this.config.id;
    }
    getSynchronizers() {
        return this.synchronizers;
    }
    getSerializers() {
        return this.serializers;
    }
    getBroadcasters() {
        return this.broadcasters;
    }
}
