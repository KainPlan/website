class MapTile {
    constructor(material, room) {
        this._material = material;
        this._room = room;
        
        this._room.add_tile(this);
    }

    set material(material) {
        this._material = material;
    }

    get material() {
        return this._material;
    }

    set room(room) {
        this._room = room;
    }

    get room() {
        return this._room;
    }
}