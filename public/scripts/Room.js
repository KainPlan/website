class Room {
    constructor(name, tiles) {
        this._name = name;
        this._tiles = tiles;
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set tiles(tiles) {
        this._tiles = tiles;
    }

    get tiles() {
        return this._tiles;
    }

    add_tile(t) {
        this._tiles.push(t);
    }
}