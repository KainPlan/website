window.onload = () => {
    let can = document.getElementById('main-canvas'),
        ctx = can.getContext('2d'),
        cpa = can.parentElement,
        cpb = cpa.getBoundingClientRect();

    let scale_out = document.getElementById('scale-out'),
        ox_out = document.getElementById('ox-out'),
        oy_out = document.getElementById('oy-out');

    let conf = {
        tilec_size: 5,
        scale: 1,
        min_scale: 0.5,
        max_scale: 2,
        ox: 0,
        oy: 0,
        map: [],
        clock_rate: 100, // [clock_rate] = Hz
    };

    // -- GENERATE RANDOM MAP -- //

    let rc = () => `rgb(
        ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}
    )`, 
        room = new Room('Test-Room', []);

    for (let y = 0; y < 1000; y++) {
        conf.map.push(new Array());
        for (let x = 0; x < 2000; x++) {
            let m = new Material(rc());
            conf.map[y][x] = new MapTile(m, room);
        }
    }

    window.onresize = () => {
        cpb = cpa.getBoundingClientRect();
        can.width = cpb.width - 10;
        // can.height = cpb.height - 25;
        can.height = Math.min(cpb.height - 10, conf.tilec_size * conf.map.length);

        conf.ox = 0;
        conf.oy = 0;

        ox_out.innerHTML = conf.ox;
        oy_out.innerHTML = conf.oy;
    };
    window.onresize();

    function zoom(ds) {
        conf.scale -= ds;
        conf.scale = Math.round(conf.scale*100)/100;

        if (conf.scale < conf.min_scale)
            conf.scale = conf.min_scale;
        else if (conf.scale > conf.max_scale)
            conf.scale = conf.max_scale;
            
        scale_out.innerHTML = `${conf.scale} (${Math.round(conf.scale * 100)}%)`;
    }

    function pan(dx, dy) {
        let nox = conf.ox - dx,
            noy = conf.oy - dy;

        if (nox > 0) {
            nox = 0;
        }
        else if (nox < Math.min(-conf.map[0].length * conf.tilec_size * conf.scale + can.width, 0)) {
            nox = Math.min(-conf.map[0].length * conf.tilec_size * conf.scale + can.width, 0);
        }

        if (noy > 0) {
            noy = 0;
        }
        else if (noy < Math.min(-conf.map.length * conf.tilec_size * conf.scale + can.height, 0)) {
            noy = Math.min(-conf.map.length * conf.tilec_size * conf.scale + can.height, 0);
        }

        dx = nox - conf.ox;
        dy = noy - conf.oy;
        
        ctx.translate(dx, dy);

        conf.ox = nox;
        conf.oy = noy;

        ox_out.innerHTML = conf.ox;
        oy_out.innerHTML = conf.oy;
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
            zoom(e.deltaY * 0.01);
        },
        on_mousedown: e => {
            mouse_ev.p_list.push(e);
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

    can.onwheel         = mouse_ev.on_zoom;
    can.onmousedown     = mouse_ev.on_mousedown;
    can.onmousemove     = mouse_ev.on_mousemove;

    can.onmouseup       = mouse_ev.on_mouseup;
    can.onmouseleave    = mouse_ev.on_mouseup;
    can.onmouseout      = mouse_ev.on_mouseup;

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
            touch_ev.p_list.push(e);
        },
        on_pointermove: e => {
            for (let i = 0; i < touch_ev.p_list.length; i++) {
                if (touch_ev.p_list[i].pointerId === e.pointerId) {
                    touch_ev.p_list[i] = e;
                    break;
                }
            }

            if (touch_ev.p_list.length === 2) {
                let mx = Math.abs(touch_ev.p_list[0].clientX - touch_ev.p_list[1].clientX),
                    my = Math.abs(touch_ev.p_list[0].clientY - touch_ev.p_list[1].clientY)
                    curr_diff = Math.sqrt(mx + my);

                if (touch_ev.prev_diff >= 0) {
                    let comp_diff = touch_ev.prev_diff - curr_diff;
                    zoom(comp_diff * 0.05);
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

    can.onpointerdown   = touch_ev.on_pointerdown;
    can.onpointermove   = touch_ev.on_pointermove;

    can.onpointerup     = touch_ev.on_pointerup;
    can.onpointercancel = touch_ev.on_pointerup;
    can.onpointerout    = touch_ev.on_pointerup;
    can.onpointerleave  = touch_ev.on_pointerup;

    function draw_grid() {
        let prev_style = ctx.strokeStyle;
        ctx.beginPath();

        for (let y = conf.tilec_size * conf.scale; 
            y < conf.map.length * conf.tilec_size * conf.scale; 
            y += conf.tilec_size * conf.scale) {
            ctx.moveTo(0, y);
            ctx.lineTo(conf.map[0].length * conf.tilec_size * conf.scale, y);
        }

        for (let x = conf.tilec_size * conf.scale; 
            x < conf.map[0].length * conf.tilec_size * conf.scale; 
            x += conf.tilec_size * conf.scale) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, conf.map.length * conf.tilec_size * conf.scale);
        }

        ctx.strokeStyle = '#f2f2f2';
        ctx.stroke();
        ctx.strokeStyle = prev_style;
    }

    function draw_map() {
        let prev_style = ctx.fillStyle,
            prev_width = ctx.lineWidth,
            prev_strok = ctx.strokeStyle;

        ctx.beginPath();
        ctx.rect(0, 0, conf.map[0].length * conf.tilec_size * conf.scale, conf.map.length * conf.tilec_size * conf.scale);

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#efefef';
        ctx.stroke();

        ctx.fillStyle = '#CE81FF';

        ctx.beginPath();
        ctx.rect(0, (conf.map.length-1) * conf.tilec_size * conf.scale, 
            conf.map[0].length * conf.tilec_size * conf.scale, conf.tilec_size * conf.scale);
        ctx.rect((conf.map[0].length-1) * conf.tilec_size * conf.scale, 0,
            conf.tilec_size * conf.scale, conf.map.length * conf.tilec_size * conf.scale);
        ctx.fill();

        ctx.fillStyle = prev_style;

        ctx.strokeStyle = prev_strok;
        ctx.lineWidth = prev_width;
    }

    function main_loop() {
        // console.time('main_loop');
        ctx.clearRect(0, 0, can.width + conf.map[0].length * conf.tilec_size * conf.scale, 
            can.height + conf.map.length * conf.tilec_size * conf.scale);
        draw_map();
        draw_grid();
        // console.timeEnd('main_loop');
    }
    window.setInterval(main_loop, 1000/conf.clock_rate);
};