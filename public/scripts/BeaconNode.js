class BeaconNode extends Node {
    constructor(x, y, z) {
        super(x, y, z);

        this.stroke = '#FFDF19';
        this.fill = 'rgba(255, 235, 111, .2)';
        this.radius = 4;

        this.update_id();
    }

    update_id() {
        this.id = `b;${this.x};${this.y};${this.z}`;
    }
}