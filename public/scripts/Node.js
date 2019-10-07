class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.edges = [];

        this.stroke = '#FF3C98';
        this.fill = 'rgba(255, 60, 152, .2)';
        this.radius = 2;
    }

    add_outgoing_conn(to) {
        this.edges.push(new Edge(this, to));
    }

    add_incoming_conn(from) {
        this.edges.push(new Edge(from, this));
    }
}