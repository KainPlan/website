class Node {
    constructor(x, y, z=null) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.edges = [];

        this.stroke = '#FF3C98';
        this.fill = 'rgba(255, 60, 152, .2)';
        this.radius = 6;

        this.update_id();
    }

    add_con(to) {
        this.edges.push(new Edge(to));
    }

    update_id() {
        this.id = `n;${this.x};${this.y};${this.z}`;
    }
}