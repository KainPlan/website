class StairsNode extends Node {
    constructor(x, y, z, to=null, height=null) {
        super(x, y, z);

        if (to)
            this.add_stairs(to, height);

        this.stroke = '#2EFFF4';
        this.fill = 'rgba(203, 255, 252, .2)';
        this.radius = 6;
    }

    add_stairs(to, height=null) {
        this.stairs = new Edge(to, height);
        this.edges.push(this.stairs);
    }
}