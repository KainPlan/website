class EndNode extends Node {   
    constructor(x, y, z, title='', desc='') {
        super(x, y, z);

        this.title = title;
        this.desc = desc;

        this.stroke = '#8A1BFF';
        this.fill = 'rgba(138, 27, 255, .2)';
        this.radius = 8;

        this.update_id();
    }

    update_id() {
        this.id = `e;${this.x};${this.y};${this.z}`;
    }
}