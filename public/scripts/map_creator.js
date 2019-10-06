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
    };

    let scale_out = document.getElementById('scale-out'),
        ox_out = document.getElementById('ox-out'),
        oy_out = document.getElementById('oy-out');

    let conf = {
        scale: 1,
        min_scale: 0.5,
        max_scale: 2,
        ox: 0,
        oy: 0,
        map: {
            elements: [],
            width: 600,
            height: 400,
            background: new Image(),
            node_radius: 1.5,
        },
        tools: {
            color: '#FF3C98',
            back_color: 'rgba(255, 60, 152, .2)',
            mode: 'pan',
            last_click: Date.now()
        },
        m2px: 5,
        clock_rate: 10, // [clock_rate] = Hz
    };

    window.onresize = () => {
        cpb = cpa.getBoundingClientRect();
        can.width = cpb.width - 10;
        can.height = Math.min(cpb.height - 10, conf.map.height * conf.m2px);

        conf.ox = 0;
        conf.oy = 0;

        ox_out.innerHTML = conf.ox;
        oy_out.innerHTML = conf.oy;

        cab = can.getBoundingClientRect();
    };
    window.onresize();

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

        ox_out.innerHTML = conf.ox;
        oy_out.innerHTML = conf.oy;
        refresh();
    }

    let gen_ev = {
        on_mousedown: (e, trgt) => {
            switch (conf.tools.mode) {
                case 'pan':
                    trgt.p_list.push(e);
                    break;
                case 'node':
                    if (Date.now() - conf.tools.last_click < 50)
                        return;
                    conf.map.elements.push(new Node(
                        (e.clientX - cab.left - conf.ox) / conf.m2px / conf.scale,
                        (e.clientY - cab.top - conf.oy) / conf.m2px / conf.scale
                    ));
                    refresh();
                    break;
                case 'goal':
                    if (Date.now() - conf.tools.last_click < 50)
                        return;
                    conf.map.elements.push(new EndNode(
                        (e.clientX - cab.left - conf.ox) / conf.m2px / conf.scale,
                        (e.clientY - cab.top - conf.oy) / conf.m2px / conf.scale,
                        window.prompt('Enter end-point title: '),
                        window.prompt('Enter end-point description: ')
                    ))
                    refresh();
                    break;
            }
            conf.tools.last_click = Date.now();
        },
    }

    let mouse_ev = {
        p_list: [],
        prev_x: -1,
        prev_y: -1,

        rm_event: e => {
            for (let i = 0; i < touch_ev.p_list.length; i++) {
                if (touch_ev.p_list[i].pointerId === e.pointerId) {
                    touch_ev.p_list.splice(i, 1);
                    return;
                }
            }
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
            }
        },
        on_mouseup: e => {
            mouse_ev.rm_event(e);
            mouse_ev.prev_x = -1;
            mouse_ev.prev_y = -1;
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

        rm_event: e => {
            for (let i = 0; i < touch_ev.p_list.length; i++) {
                if (touch_ev.p_list[i].pointerId === e.pointerId) {
                    touch_ev.p_list.splice(i, 1);
                    return;
                }
            }
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
            }
        },
        on_pointerup: e => {
            touch_ev.rm_event(e);
            touch_ev.prev_diff = -1;
            touch_ev.prev_x = -1;
            touch_ev.prev_y = -1;
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
        document.getElementsByClassName('active-tool')[0].classList.remove('active-tool');
        tools[to].classList.add('active-tool');
    }

    for (let t of Object.keys(tools)) {
        tools[t].onclick = () => {
            change_mouse_mode(t);
        }
    }

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

    function draw_elements() {
        let prev_style = ctx.strokeStyle
            prev_fill_style = ctx.fillStyle,
            prev_line_width = ctx.lineWidth;

        ctx.strokeStyle = conf.tools.color;
        ctx.fillStyle = conf.tools.back_color;
        ctx.lineWidth = 3;
        conf.map.elements.forEach(n => {
            ctx.beginPath();
            ctx.ellipse(n.x * conf.m2px * conf.scale,
                n.y * conf.m2px * conf.scale,
                conf.map.node_radius * conf.m2px * conf.scale,
                conf.map.node_radius * conf.m2px * conf.scale,
                0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        });

        ctx.fillStyle = prev_fill_style;
        ctx.strokeStyle = prev_style;
        ctx.lineWidth = prev_line_width;
    }

    function refresh() {
        console.time('main_loop');

        ctx.clearRect(0, 0, can.width + conf.map.width * conf.m2px * conf.scale,
            can.height + conf.map.height * conf.m2px * conf.scale);
        ctx.drawImage(conf.map.background, 0, 0,
            conf.map.width * conf.m2px * conf.scale,
            conf.map.height * conf.m2px * conf.scale);
        draw_grid();
        draw_elements();

        console.timeEnd('main_loop');
    }

    conf.map.background.onload = () => {
        refresh();
        // window.setInterval(main_loop, 1000/conf.clock_rate);
    };
    conf.map.background.src = '/media/map_first_floor.png';
};