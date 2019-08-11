module.exports = class Entity {

    constructor(entityId, uuid, type, location) {
        this.entityId = entityId;
        this.uuid = uuid;
        this.type = type;
        this.location = location;
    }

    teleport(location) { }
    spawn() { }
    despawn() { }

}
