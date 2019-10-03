class Material {
    constructor(color) {
        this._color = color;
    }

    set color(color) {
        this._color = color;
    }

    get color() {
        return this._color;
    }
}