class EndNode extends Node {   
    constructor(x, y, title='', desc='') {
        super(x, y);
        this.title = title;
        this.desc = desc;

        this.stroke = '#8A1BFF';
        this.fill = 'rgba(138, 27, 255, .2)';
        this.radius = 3;
    }
}