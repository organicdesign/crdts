export class CRDT {
    constructor(config) {
        this.broadcasters = [];
        this.config = config;
    }
    addBroadcaster(broadcaster) {
        this.broadcasters.push(broadcaster);
    }
    get id() {
        return this.config.id;
    }
    get generateTimestamp() {
        var _a;
        return (_a = this.config.generateTimestamp) !== null && _a !== void 0 ? _a : Date.now;
    }
    broadcast(data) {
        for (const broadcaster of this.broadcasters) {
            broadcaster(data);
        }
    }
}
