window.onload = () => {
    let can = document.getElementById('main-canvas'),
        cab = can.getBoundingClientRect(),
        ctx = can.getContext('2d'),
        cpa = can.parentElement,
        cpb = cpa.getBoundingClientRect();

    let tools = {
        pan: document.getElementById('pan-tool'),
        move: document.getElementById('move-tool'),
        goal: document.getElementById('goal-tool'),
        node: document.getElementById('node-tool'),
        conn: document.getElementById('conn-tool'),
        del: document.getElementById('del-tool'),
    };

    let ftools = {
        up: document.getElementById('floor-up'),
        down: document.getElementById('floor-down'),
    };

    let scale_out = document.getElementById('scale-out'),
        floor_out = document.getElementById('floor-out');

    let node_info = {
        _: document.getElementById('node-info'),
        title: document.getElementById('node-info-title'),
        desc: document.getElementById('node-info-desc')
    };

    let conf = {
        scale: 1,
        min_scale: 0.5,
        max_scale: 2,
        ox: 0,
        oy: 0,
        map: {
            nodes: [],
            width: 750,
            height: 500,
            background: {
                srcs: [
                    '/media/map_0.png',
                    '/media/map_1.png',
                ],
                objs: [],
            },
            current_floor: 0,
        },
        tools: {
            mode: 'pan',
            from: null,
            last_click: Date.now(),
            conn_color: 'rgba(227, 27, 11, .5)',
        },
        m2px: 5,
        clock_rate: 10, // [clock_rate] = Hz
    };

    for (let i = 0; i < conf.map.background.srcs.length; i++) {
        conf.map.background.objs.push(new Image());
        conf.map.nodes.push(new Array());
    }

    // ---------------------------------------------------------------------------------------------------------------------- //

    function zoom(ds, cx, cy) {
        let psc = conf.scale;

        conf.scale -= ds;
        conf.scale = Math.round(conf.scale * 100) / 100;

        if (conf.scale < conf.min_scale)
            conf.scale = conf.min_scale;
        else if (conf.scale > conf.max_scale)
            conf.scale = conf.max_scale;

        scale_out.innerHTML = `${conf.scale} (${Math.round(conf.scale * 100)}%)`;
        pan(
            ((cx - conf.ox) / psc) * conf.scale + conf.ox - cx,
            ((cy - conf.oy) / psc) * conf.scale + conf.oy - cy
        );
        refresh();
    }

    function pan(dx, dy) {
        let nox = conf.ox - dx,
            noy = conf.oy - dy;

        if (nox > 0) {
            nox = 0;
        } else if (nox < Math.min(-conf.map.width * conf.m2px * conf.scale + can.width, 0)) {
            nox = Math.min(-conf.map.width * conf.m2px * conf.scale + can.width, 0);
        }

        if (noy > 0) {
            noy = 0;
        } else if (noy < Math.min(-conf.map.height * conf.m2px * conf.scale + can.height, 0)) {
            noy = Math.min(-conf.map.height * conf.m2px * conf.scale + can.height, 0);
        }

        dx = nox - conf.ox;
        dy = noy - conf.oy;

        ctx.translate(dx, dy);

        conf.ox = nox;
        conf.oy = noy;

        refresh();
    }

    function get_node(x, y) {
        for (let n of conf.map.nodes[conf.map.current_floor]) {
            if (
                x >= n.x - n.radius &&
                x <= n.x + n.radius &&
                y >= n.y - n.radius &&
                y <= n.y + n.radius
            ) {
                return n;
            }
        }

        return null;
    }

    function canv_to_map(x, y) {
        return [
            (x - conf.ox) / conf.m2px / conf.scale,
            (y - conf.oy) / conf.m2px / conf.scale
        ];
    }

    function map_to_canv(u) {
        return u * conf.m2px * conf.scale;
    }

    function disp_node_info(n) {
        if (n instanceof EndNode) {
            node_info._.style.display = 'inline-block';
            node_info._.style.left = map_to_canv(n.x) + conf.ox + cab.left + "px";
            node_info._.style.top = map_to_canv(n.y) + conf.oy + cab.top + "px";

            node_info.title.innerHTML = n.title;
            node_info.desc.innerHTML = n.desc;

            if (node_info.title.innerHTML === 'Title') {
                node_info.title.onfocus = () => {
                    node_info.title.innerHTML = '';
                };
            }
            if (node_info.desc.innerHTML === 'Description') {
                node_info.desc.onfocus = () => {
                    node_info.desc.innerHTML = '';
                };
            }

            node_info.title.onblur = () => {
                n.title = node_info.title.innerHTML;
                node_info.title.onfocus = () => {};
            };
            node_info.desc.onblur = () => {
                n.desc = node_info.desc.innerHTML;
                node_info.desc.onfocus = () => {};
            };
        }
    }

    function hide_node_info() {
        node_info._.style.display = 'none';
    }

    function update_floor_status() {   
        if (conf.map.current_floor <= 0) {
            conf.map.current_floor = 0;
            ftools.down.classList.add('disabled');
        } else {
            ftools.down.classList.remove('disabled');
        } 
        
        if (conf.map.current_floor >= conf.map.background.srcs.length-1) {
            conf.map.current_floor = conf.map.background.srcs.length-1;
            ftools.up.classList.add('disabled');
        } else {
            ftools.up.classList.remove('disabled');
        }

        floor_out.innerHTML = conf.map.current_floor;
        refresh();
    }

    // ---------------------------------------------------------------------------------------------------------------------- //

    window.onresize = () => {
        cpb = cpa.getBoundingClientRect();
        can.width = cpb.width - 10;
        can.height = Math.min(cpb.height - 10, conf.map.height * conf.m2px);

        conf.ox = 0;
        conf.oy = 0;

        cab = can.getBoundingClientRect();
        refresh();
    };

    let gen_ev = {
        on_mousedown: (e, trgt) => {
            switch (conf.tools.mode) {
                case 'pan': {
                    let n = get_node(...canv_to_map(e.clientX - cab.left, e.clientY - cab.top));
                    if (n) {
                        if (Date.now() - conf.tools.last_click < 50)
                            return;
                        console.log(n);
                        disp_node_info(n);
                    } else {
                        trgt.p_list.push(e);
                        hide_node_info();
                    }
                }
                break;
                case 'move': {
                    let n = get_node(...canv_to_map(e.clientX - cab.left, e.clientY - cab.top));
                    if (n) {
                        trgt.mv_node = n;
                        mouse_ev.mv_node = n;
                    }
                }
                break;
                case 'node': {
                    if (get_node(...canv_to_map(e.clientX - cab.left, e.clientY - cab.top)) 
                        || Date.now() - conf.tools.last_click < 50)
                        return;
                    conf.map.nodes[conf.map.current_floor].push(new Node(
                        (e.clientX - cab.left - conf.ox) / conf.m2px / conf.scale,
                        (e.clientY - cab.top - conf.oy) / conf.m2px / conf.scale
                    ));
                    refresh();
                }    
                break;
                case 'goal': {
                    if (get_node(...canv_to_map(e.clientX - cab.left, e.clientY - cab.top)) 
                        || Date.now() - conf.tools.last_click < 50)
                        return;
                    hide_node_info();

                    let en = new EndNode(
                        (e.clientX - cab.left - conf.ox) / conf.m2px / conf.scale,
                        (e.clientY - cab.top - conf.oy) / conf.m2px / conf.scale,
                        'Title',
                        'Description',
                    );

                    conf.map.nodes[conf.map.current_floor].push(en);
                    disp_node_info(en);
                    refresh();
                }    
                break;
                case 'conn': {
                    let node = get_node(...canv_to_map(e.clientX - cab.left, e.clientY - cab.top));
                    if (Date.now() - conf.tools.last_click < 50)
                        return;
                    if (node && conf.tools.from && node !== conf.tools.from) {
                        conf.tools.from.add_outgoing_conn(node);
                        node.add_incoming_conn(conf.tools.from);
                        conf.tools.from = null;
                    } else if (node) {
                        conf.tools.from = node;
                    }
                    refresh();
                }
                break;
                case 'del': {
                    let node = get_node(...canv_to_map(e.clientX - cab.left, e.clientY - cab.top));
                    if (node) {
                        for (let i = 0; i < conf.map.nodes[conf.map.current_floor].length; i++) {
                            if (node === conf.map.nodes[conf.map.current_floor][i]) {
                                for (let conn of node.edges) {
                                    let dest = conn.to !== node ? conn.to : conn.from;
                                    for (let j = dest.edges.length-1; j >= 0; j--) {
                                        if ([dest.edges[j].from, dest.edges[j].to].includes(node))
                                            dest.edges.splice(j, 1);
                                    }
                                }

                                conf.map.nodes[conf.map.current_floor].splice(i, 1);
                                break;
                            }
                        }
                    }
                    refresh();
                }
                break;
            }
            conf.tools.last_click = Date.now();
        },
    }

    let mouse_ev = {
        p_list: [],
        prev_x: -1,
        prev_y: -1,
        mv_node: null,

        rm_event: e => {
            for (let i = 0; i < mouse_ev.p_list.length; i++) {
                if (mouse_ev.p_list[i].pointerId === e.pointerId) {
                    mouse_ev.p_list.splice(i, 1);
                    break;
                }
            }
            mouse_ev.reset();
        },

        reset: () => {
            mouse_ev.prev_x = -1;
            mouse_ev.prev_y = -1;
            mouse_ev.mv_node = null;
        },
        reset_all: () => {
            mouse_ev.p_list = [];
            mouse_ev.reset();
        },

        on_zoom: e => {
            e.preventDefault();
            zoom(e.deltaY * 0.01, e.clientX - cab.left, e.clientY - cab.top);
        },
        on_mousedown: e => {
            gen_ev.on_mousedown(e, mouse_ev);
        },
        on_mousemove: e => {
            for (let i = 0; i < mouse_ev.p_list.length; i++) {
                if (mouse_ev.p_list[i].pointerId === e.pointerId) {
                    mouse_ev.p_list[i] = e;
                    break;
                }
            }

            if (mouse_ev.p_list.length === 1) {
                let c_x = e.clientX,
                    c_y = e.clientY;

                if (mouse_ev.prev_x >= 0) {
                    let mov_x = mouse_ev.prev_x - c_x,
                        mov_y = mouse_ev.prev_y - c_y;
                    pan(mov_x, mov_y);
                }

                mouse_ev.prev_x = c_x;
                mouse_ev.prev_y = c_y;
            } else if (mouse_ev.mv_node) {
                [mouse_ev.mv_node.x, mouse_ev.mv_node.y] = canv_to_map(e.clientX - cab.left, e.clientY - cab.top);
                refresh();
            } else if (conf.tools.from) {
                refresh();
                let prev_style = ctx.strokeStyle,
                    prev_weight = ctx.lineWidth;
                ctx.moveTo(map_to_canv(conf.tools.from.x), map_to_canv(conf.tools.from.y));
                ctx.lineTo(e.clientX - cab.left - conf.ox, e.clientY - cab.top - conf.oy);
                ctx.lineWidth = 3;
                ctx.strokeStyle = conf.tools.conn_color;
                ctx.stroke();
                ctx.strokeStyle = prev_style;
                ctx.lineWidth = prev_weight;
            }
        },
        on_mouseup: e => {
            mouse_ev.rm_event(e);
        },
    };

    can.onwheel = mouse_ev.on_zoom;
    can.onmousedown = mouse_ev.on_mousedown;
    can.onmousemove = mouse_ev.on_mousemove;

    can.onmouseup = mouse_ev.on_mouseup;
    can.onmouseleave = mouse_ev.on_mouseup;
    can.onmouseout = mouse_ev.on_mouseup;

    let touch_ev = {
        p_list: [],
        prev_diff: -1,
        prev_x: -1,
        prev_y: -1,
        mv_node: null,

        rm_event: e => {
            for (let i = 0; i < touch_ev.p_list.length; i++) {
                if (touch_ev.p_list[i].pointerId === e.pointerId) {
                    touch_ev.p_list.splice(i, 1);
                    break;
                }
            }
            touch_ev.reset();
        },

        reset: () => {
            touch_ev.prev_diff = -1;
            touch_ev.prev_x = -1;
            touch_ev.prev_y = -1;
            touch_ev.mv_node = null;
        },
        reset_all: () => {
            touch_ev.p_list = [];
            touch_ev.reset();
        },

        on_pointerdown: e => {
            gen_ev.on_mousedown(e, touch_ev);
        },
        on_pointermove: e => {
            for (let i = 0; i < touch_ev.p_list.length; i++) {
                if (touch_ev.p_list[i].pointerId === e.pointerId) {
                    touch_ev.p_list[i] = e;
                    break;
                }
            }

            if (touch_ev.p_list.length === 2) {
                let x0 = touch_ev.p_list[0].clientX,
                    x1 = touch_ev.p_list[1].clientX,
                    y0 = touch_ev.p_list[0].clientY,
                    y1 = touch_ev.p_list[1].clientY

                let dx = Math.abs(x0 - x1),
                    dy = Math.abs(y0 - y1),
                    curr_diff = Math.max(dx, dy);

                if (touch_ev.prev_diff >= 0) {
                    let comp_diff = touch_ev.prev_diff - curr_diff;
                    zoom(comp_diff * 0.02,
                        Math.min(x0, x1) - cab.left + dx / 2,
                        Math.min(y0, y1) - cab.top + dy / 2);
                }

                touch_ev.prev_diff = curr_diff;
            } else if (touch_ev.p_list.length === 1) {
                let c_x = e.clientX,
                    c_y = e.clientY;

                if (touch_ev.prev_x >= 0) {
                    let mov_x = touch_ev.prev_x - c_x,
                        mov_y = touch_ev.prev_y - c_y;
                    pan(mov_x, mov_y);
                }

                touch_ev.prev_x = c_x;
                touch_ev.prev_y = c_y;
            } else if (touch_ev.mv_node) {
                [touch_ev.mv_node.x, touch_ev.mv_node.y] = canv_to_map(e.clientX - cab.left, e.clientY - cab.top);
                refresh();
            } else if (conf.tools.from) {
                refresh();
            }
        },
        on_pointerup: e => {
            touch_ev.rm_event(e);
        },
    }

    can.onpointerdown = touch_ev.on_pointerdown;
    can.onpointermove = touch_ev.on_pointermove;

    can.onpointerup = touch_ev.on_pointerup;
    can.onpointercancel = touch_ev.on_pointerup;
    can.onpointerout = touch_ev.on_pointerup;
    can.onpointerleave = touch_ev.on_pointerup;

    function change_mouse_mode(to) {
        conf.tools.mode = to;
        conf.tools.from = null;

        hide_node_info();
        mouse_ev.reset_all();
        touch_ev.reset_all();

        document.getElementsByClassName('active-tool')[0].classList.remove('active-tool');
        tools[to].classList.add('active-tool');
    }

    for (let t of Object.keys(tools)) {
        tools[t].onclick = () => {
            change_mouse_mode(t);
        }
    }

    ftools.up.onclick = () => {
        conf.map.current_floor++;
        update_floor_status();
    };
    
    ftools.down.onclick = () => {
        conf.map.current_floor--;
        update_floor_status();
    };

    // ---------------------------------------------------------------------------------------------------------------------- //

    function draw_grid() {
        let prev_style = ctx.strokeStyle;
        ctx.beginPath();

        for (let y = conf.m2px * conf.scale; y < conf.map.height * conf.m2px * conf.scale; y += conf.m2px * conf.scale) {
            ctx.moveTo(0, y);
            ctx.lineTo(conf.map.width * conf.m2px * conf.scale, y);
        }

        for (let x = conf.m2px * conf.scale; x < conf.map.width * conf.m2px * conf.scale; x += conf.m2px * conf.scale) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, conf.map.height * conf.m2px * conf.scale);
        }

        ctx.strokeStyle = '#f2f2f2';
        ctx.stroke();
        ctx.strokeStyle = prev_style;
    }

    function draw_nodes() {
        let prev_style = ctx.strokeStyle
        prev_fill_style = ctx.fillStyle,
            prev_line_width = ctx.lineWidth;

        ctx.lineWidth = 3;
        conf.map.nodes[conf.map.current_floor].forEach(n => {
            ctx.beginPath();
            ctx.strokeStyle = n.stroke;
            ctx.fillStyle = n.fill;
            ctx.ellipse(map_to_canv(n.x),
                map_to_canv(n.y),
                map_to_canv(n.radius),
                map_to_canv(n.radius),
                0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            n.edges.filter(e => e.from === n).forEach(e => {
                ctx.beginPath();
                ctx.strokeStyle = e.color;
                ctx.moveTo(map_to_canv(e.from.x), map_to_canv(e.from.y));
                ctx.lineTo(map_to_canv(e.to.x), map_to_canv(e.to.y));
                ctx.stroke();
            });
        });

        ctx.fillStyle = prev_fill_style;
        ctx.strokeStyle = prev_style;
        ctx.lineWidth = prev_line_width;
    }

    function refresh() {
        console.time('refresh');

        ctx.clearRect(0, 0, can.width + conf.map.width * conf.m2px * conf.scale,
            can.height + conf.map.height * conf.m2px * conf.scale);
        ctx.drawImage(conf.map.background.objs[conf.map.current_floor], 0, 0,
            conf.map.width * conf.m2px * conf.scale,
            conf.map.height * conf.m2px * conf.scale);
        // draw_grid();
        draw_nodes();

        console.timeEnd('refresh');
    }

    conf.map.background.objs[0].onload = () => {
        window.onresize();
    };

    for (let [i, src] of conf.map.background.srcs.entries()) {
        conf.map.background.objs[i].src = src;
    }
};