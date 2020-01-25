window.onload = () => {
    let mapi = getMapi();

    let can = document.getElementById('main-canvas'),
        cab = can.getBoundingClientRect(),
        ctx = can.getContext('2d'),
        cpa = can.parentElement,
        cpb = cpa.getBoundingClientRect();

    mapi.can = can;
    mapi.cab = cab;
    mapi.ctx = ctx;

    let tools = {
        pan: document.getElementById('pan-tool'),
        move: document.getElementById('move-tool'),
        goal: document.getElementById('goal-tool'),
        node: document.getElementById('node-tool'),
        conn: document.getElementById('conn-tool'),
        del: document.getElementById('del-tool'),
        flr: document.getElementById('flr-tool'),
        ble: document.getElementById('ble-tool'),
    };

    let ftools = {
        up: document.getElementById('floor-up'),
        down: document.getElementById('floor-down'),
    };

    let floor_out = document.getElementById('floor-out');

    let node_info = {
        _: document.getElementById('node-info'),
        title: document.getElementById('node-info-title'),
        desc: document.getElementById('node-info-desc')
    };

    let stairs_info = {
        _: document.getElementById('stairs-info'),
        height: document.getElementById('stairs-info-height'),
    };

    let key_codes = {
        _: document.getElementById('key-code-wrapper'),
        close: document.getElementById('close-key-codes'),
    };

    let conf = mapi.conf;
    conf.tools = {
        mode: 'pan',
        from: null,
        last_click: Date.now(),
        conn_color: 'rgba(227, 27, 11, .5)',
        unsaved: false,
    };

    for (let i = 0; i < conf.map.background.srcs.length; i++) {
        conf.map.background.objs.push(new Image());
        conf.map.nodes.push(new Array());
        conf.map.beacons.push(new Array());
    }

    // ---------------------------------------------------------------------------------------------------------------------- //

    function format_date(d) {
        return `${d.getHours().toString().padStart(2,0)}:${d.getMinutes().toString().padStart(2,0)} ${d.getDate().toString().padStart(2,0)}.${(d.getMonth()+1).toString().padStart(2,0)}.${d.getFullYear()}`;
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

    function get_beacon(x, y) {
        for (let b of conf.map.beacons[conf.map.current_floor]) {
            if (
                x >= b.x - b.radius &&
                x <= b.x + b.radius &&
                y >= b.y - b.radius &&
                y <= b.y + b.radius
            ) {
                return b;
            }
        }

        return null;
    }

    function is_printable_char(e) {
        return (e.key.match(/^[\w\s.]$/) || e.keyCode === 13) && e.keyCode !== 9;
    }

    function disp_node_info(n) {
        function check_node_info_position() {
            let nib = node_info._.getBoundingClientRect();
            if (nib.bottom > window.innerHeight)
                node_info._.style.top = window.innerHeight - nib.height - 5 + "px";
            if (nib.right > window.innerWidth)
                node_info._.style.left = window.innerWidth - nib.width - 5 + "px";
        }

        if (n instanceof EndNode) {
            hide_stairs_info();

            node_info._.style.display = 'inline-block';
            node_info._.style.left = mapi.map_to_canv(n.x) + conf.ox + cab.left + "px";
            node_info._.style.top = mapi.map_to_canv(n.y) + conf.oy + cab.top + "px";

            check_node_info_position();

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

            node_info.title.onkeydown = e => {
                if (node_info.title.innerHTML.length >= 64 && is_printable_char(e)) {
                    e.preventDefault();
                } else {
                    check_node_info_position();
                }
            };
            node_info.desc.onkeydown = e => {
                if (node_info.desc.innerHTML.length >= 512 && is_printable_char(e)) {
                    e.preventDefault();
                } else {
                    check_node_info_position();
                }
            };

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

    function disp_stairs_info(n) {
        function check_stairs_info_position() {
            let sib = stairs_info._.getBoundingClientRect();
            if (sib.bottom > window.innerHeight)
                stairs_info._.style.top = window.innerHeight - sib.height - 5 + "px";
            if (sib.right > window.innerWidth)
                stairs_info._.style.left = window.innerWidth - sib.width - 5 + "px";
        }

        if (n instanceof StairsNode) {
            hide_node_info();

            stairs_info._.style.display = 'inline-block';
            stairs_info._.style.left = mapi.map_to_canv(n.x) + conf.ox + cab.left + "px";
            stairs_info._.style.top = mapi.map_to_canv(n.y) + conf.oy + cab.top + "px";

            check_stairs_info_position();
            stairs_info.height.value = n.height || '';

            stairs_info.height.onchange = () => {
                n.stairs.length = +stairs_info.height.value;
            };
        }
    }

    function hide_stairs_info() {
        stairs_info._.style.display = 'none';
    }

    function update_floor_status() {
        if (conf.map.current_floor <= 0) {
            conf.map.current_floor = 0;
            ftools.down.classList.add('disabled');
        } else {
            ftools.down.classList.remove('disabled');
        }

        if (conf.map.current_floor >= conf.map.background.srcs.length - 1) {
            conf.map.current_floor = conf.map.background.srcs.length - 1;
            ftools.up.classList.add('disabled');
        } else {
            ftools.up.classList.remove('disabled');
        }

        mouse_ev.reset_all();
        touch_ev.reset_all();

        hide_key_codes();
        hide_node_info();
        hide_stairs_info();

        conf.tools.from = null;

        floor_out.innerHTML = conf.map.current_floor;
        refresh();
    }

    function show_key_codes() {
        key_codes._.style.display = 'flex';
    }

    function hide_key_codes() {
        key_codes._.style.display = 'none';
    }

    // ---------------------------------------------------------------------------------------------------------------------- //

    window.onresize = () => {
        cpb = cpa.getBoundingClientRect();
        can.width = cpb.width - 2;
        can.height = Math.min(cpb.height - 2, conf.map.height * conf.m2px);

        conf.ox = 0;
        conf.oy = 0;

        cab = can.getBoundingClientRect();
        refresh();
    };

    let gen_ev = {
        on_mousedown: (e, trgt) => {
            switch (conf.tools.mode) {
                case 'pan': {
                    let n = get_node(...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top));
                    if (n) {
                        if (Date.now() - conf.tools.last_click < 50)
                            return;
                        disp_node_info(n);
                        disp_stairs_info(n);
                    } else {
                        trgt.p_list.push(e);
                        hide_node_info();
                        hide_stairs_info();
                    }
                }
                break;
            case 'move': {
                let [x, y] = mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top),
                    n = get_node(x, y) || get_beacon(x, y);
                if (n) {
                    trgt.mv_node = n;
                }
            }
            break;
            case 'node': {
                if (get_node(...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top)) ||
                    Date.now() - conf.tools.last_click < 50)
                    return;
                conf.map.nodes[conf.map.current_floor].push(new Node(
                    ...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top),
                    conf.map.current_floor
                ));
                conf.tools.unsaved = true;
                refresh();
            }
            break;
            case 'goal': {
                if (get_node(...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top)) ||
                    Date.now() - conf.tools.last_click < 50)
                    return;
                hide_node_info();

                let en = new EndNode(
                    ...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top),
                    conf.map.current_floor,
                    'Title',
                    'Description',
                );

                conf.map.nodes[conf.map.current_floor].push(en);
                disp_node_info(en);
                conf.tools.unsaved = true;
                refresh();
            }
            break;
            case 'conn': {
                let node = get_node(...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top));
                if (Date.now() - conf.tools.last_click < 50)
                    return;
                if (node && conf.tools.from && node !== conf.tools.from) {
                    let not_included = true;

                    node.edges.forEach(e => {
                        if (e.to === conf.tools.from) {
                            not_included = false;
                            return;
                        }
                    });
                
                    if (not_included) {
                        conf.tools.from.add_con(node);
                        node.add_con(conf.tools.from);
                        conf.tools.from = null;
                    }
                    conf.tools.unsaved = true;
                } else if (node) {
                    conf.tools.from = node;
                }
                refresh();
            }
            break;
            case 'del': {
                let node = get_node(...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top));

                if (node) {
                    if (node instanceof StairsNode) {
                        let trgt_flr = node.stairs.to.z;
                        for (let i = 0; i < conf.map.nodes[trgt_flr].length; i++) {
                            if (node.stairs.to === conf.map.nodes[trgt_flr][i]) {
                                for (let conn of node.stairs.to.edges) {
                                    for (let j = conn.to.edges.length - 1; j >= 0; j--) {
                                        if (conn.to.edges[j].to === node.stairs.to) {
                                            conn.to.edges.splice(j, 1);
                                        }
                                    }
                                }
                                conf.map.nodes[trgt_flr].splice(i, 1);
                                break;
                            }
                        }
                    }

                    for (let i = 0; i < conf.map.nodes[conf.map.current_floor].length; i++) {
                        if (node === conf.map.nodes[conf.map.current_floor][i]) {
                            for (let conn of node.edges) {
                                for (let j = conn.to.edges.length - 1; j >= 0; j--) {
                                    if (conn.to.edges[j].to === node) {
                                        conn.to.edges.splice(j, 1);
                                    }
                                }
                            }
                            conf.map.nodes[conf.map.current_floor].splice(i, 1);
                            break;
                        }
                    }
                    conf.tools.unsaved = true;
                }
                refresh();
            }
            break;
            case 'flr': {
                if (get_node(...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top)) 
                    || Date.now() - conf.tools.last_click < 50
                    || conf.map.current_floor === conf.map.nodes.length-1)
                    return;

                let bsn = new StairsNode(
                    ...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top), 
                    conf.map.current_floor
                );
                let tsn = new StairsNode(bsn.x, bsn.y, conf.map.current_floor+1, bsn);
                bsn.add_stairs(tsn);

                conf.map.nodes[conf.map.current_floor].push(bsn);
                conf.map.nodes[conf.map.current_floor+1].push(tsn);

                disp_stairs_info(bsn);
                conf.tools.unsaved = true;
                refresh();
            }
            break;
            case 'ble': {
                if (get_beacon(...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top)) 
                    || Date.now() - conf.tools.last_click < 50)
                    return;

                conf.map.beacons[conf.map.current_floor].push(new BeaconNode(
                    ...mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top),
                    conf.map.current_floor
                ));
                conf.tools.unsaved = true;
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
            if (!(conf.scale === conf.max_scale && conf.deltaY < 0)) {
                e.preventDefault();
                mapi.zoom(e.deltaY < 0 ? -0.05 : 0.05, e.clientX - cab.left, e.clientY - cab.top);
            }
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
                    mapi.pan(mov_x, mov_y);
                }

                mouse_ev.prev_x = c_x;
                mouse_ev.prev_y = c_y;
            } else if (mouse_ev.mv_node) {
                [mouse_ev.mv_node.x, mouse_ev.mv_node.y] = mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top);
                mouse_ev.mv_node.update_id();
                if (mouse_ev.mv_node instanceof StairsNode) {
                    [mouse_ev.mv_node.stairs.to.x, mouse_ev.mv_node.stairs.to.y] = 
                        mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top);
                    mouse_ev.mv_node.stairs.to.update_id();
                }
                conf.tools.unsaved = true;
                refresh();
            } else if (conf.tools.from) {
                refresh();
                let prev_style = ctx.strokeStyle,
                    prev_weight = ctx.lineWidth;
                ctx.moveTo(mapi.map_to_canv(conf.tools.from.x), mapi.map_to_canv(conf.tools.from.y));
                ctx.lineTo(e.clientX - cab.left - conf.ox, e.clientY - cab.top - conf.oy);
                ctx.lineWidth = 3;
                ctx.strokeStyle = conf.tools.conn_color;
                ctx.stroke();
                ctx.strokeStyle = prev_style;
                ctx.lineWidth = prev_weight;
                conf.tools.unsaved = true;
            }
        },
        on_mouseup: e => {
            mouse_ev.rm_event(e);
        },
    };

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

                if (touch_ev.prev_diff >= 0 && !(conf.scale === conf.max_scale && conf.deltaY < 0)) {
                    let comp_diff = touch_ev.prev_diff - curr_diff;
                    mapi.zoom(comp_diff * 0.02,
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
                    mapi.pan(mov_x, mov_y);
                }

                touch_ev.prev_x = c_x;
                touch_ev.prev_y = c_y;
            } else if (touch_ev.mv_node) {
                [touch_ev.mv_node.x, touch_ev.mv_node.y] = mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top);
                touch_ev.mv_node.update_id();
                if (touch_ev.mv_node instanceof StairsNode) {
                    [touch_ev.mv_node.stairs.to.x, touch_ev.mv_node.stairs.to.y] = 
                        mapi.canv_to_map(e.clientX - cab.left, e.clientY - cab.top);
                    touch_ev.mv_node.stairs.to.update_id();
                }
                conf.tools.unsaved = true;
                refresh();
            }
        },
        on_pointerup: e => {
            touch_ev.rm_event(e);
        },
    }

    function change_mouse_mode(to) {
        conf.tools.mode = to;
        conf.tools.from = null;

        hide_node_info();
        hide_stairs_info();

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

    key_codes.close.onclick = hide_key_codes;

    window.onkeydown = e => {
        if (document.activeElement !== document.body)
            return;

        if (e.keyCode === 27) {
            hide_key_codes();
            hide_node_info();
            hide_stairs_info();

            if (conf.tools.mode === 'conn') {
                conf.tools.from = null;
                refresh();
            } 
        } else if (e.ctrlKey && !e.altKey) {
            switch (e.key) {
                case '?': {
                    e.preventDefault();
                    if (key_codes._.style.display === 'none') {
                        show_key_codes();
                    } else {
                        hide_key_codes();
                    }
                }
                break;
                case '+':
                    e.preventDefault();
                    ftools.up.click();
                break;
                case '-':
                    e.preventDefault();
                    ftools.down.click();
                break;
                case 's':
                    e.preventDefault();
                    save_map();
                break;
                case 'S':
                    e.preventDefault();
                    save_map_as();
                break;
                case 'o':
                    e.preventDefault();
                    open_map();
                break;
            }
        } else if (!e.ctrlKey && !e.altKey) {
            switch (e.key) {
                case 'd':
                case '0':
                    change_mouse_mode('pan');
                    break;
                case 'm':
                case '1':
                    change_mouse_mode('move');
                    break;
                case 'e':
                case '2':
                    change_mouse_mode('goal');
                    break;
                case 'n':
                case '3':
                    change_mouse_mode('node');
                    break;
                case 'c':
                case '4':
                    change_mouse_mode('conn');
                    break;
                case 'r':
                case '5':
                    change_mouse_mode('del');
                    break;
                case 's':
                case '6':
                    change_mouse_mode('flr');
                    break;
                case 'b':
                case '7':
                    change_mouse_mode('ble');
                    break;
            }
        }
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
        let past_nodes = [];
        conf.map.nodes[conf.map.current_floor].forEach(n => {
            ctx.beginPath();
            ctx.strokeStyle = n.stroke;
            ctx.fillStyle = n.fill;
            ctx.ellipse(mapi.map_to_canv(n.x),
                mapi.map_to_canv(n.y),
                mapi.map_to_canv(n.radius),
                mapi.map_to_canv(n.radius),
                0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            n.edges.filter(e => !past_nodes.includes(e.to) && e.to.z === n.z).forEach(e => {
                ctx.beginPath();
                ctx.strokeStyle = e.color;
                ctx.moveTo(mapi.map_to_canv(n.x), mapi.map_to_canv(n.y));
                ctx.lineTo(mapi.map_to_canv(e.to.x), mapi.map_to_canv(e.to.y));
                ctx.stroke();
            });

            past_nodes.push(n);
        });

        ctx.fillStyle = prev_fill_style;
        ctx.strokeStyle = prev_style;
        ctx.lineWidth = prev_line_width;
    }

    function draw_beacons() {
        let prev_style = ctx.strokeStyle
        prev_fill_style = ctx.fillStyle,
            prev_line_width = ctx.lineWidth;

        ctx.lineWidth = 3;
        conf.map.beacons[conf.map.current_floor].forEach(b => {
            ctx.beginPath();
            ctx.strokeStyle = b.stroke;
            ctx.fillStyle = b.fill;
            ctx.ellipse(mapi.map_to_canv(b.x),
                mapi.map_to_canv(b.y),
                mapi.map_to_canv(b.radius),
                mapi.map_to_canv(b.radius),
                0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
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
        draw_beacons();

        console.timeEnd('refresh');
    }
    mapi.refresh = refresh;

    mapi.gen_ev = gen_ev;
    mapi.mouse_ev = mouse_ev;
    mapi.touch_ev = touch_ev;

    function show_loading() {
        document.getElementById('loading-back').style.display = 'flex';
    }
    
    function stop_loading() {
        window.setTimeout(() => {
            document.getElementById('loading-back').style.display = 'none';
        }, 150);
    }

    function update_map_description(name) {
        document.getElementById('map-name').innerHTML = name;
        document.getElementById('map-version').innerHTML = conf.map.version;
    }

    function save_map_as() {
        document.getElementById('map-saver-back').style.display = 'block';
        let sv_bt = document.getElementById('map-saver-save');
        sv_bt.classList.add('disabled');
        sv_bt.onclick = () => {};

        document.getElementById('close-map-saver').onclick = () => {
            document.getElementById('map-saver-back').style.display = 'none';
        };

        fetch('/api/maps')
        .then(res => res.json())
        .then(res => {
            if (!res.success) {
                document.getElementById('close-map-saver').click();
            } else {
                let target = document.getElementById('map-saver-items');
                target.innerHTML = '';
                res.maps.forEach(m => {
                    let s = document.createElement('span');
                    s.innerHTML = m.name;
                    s.onclick = () => {
                        in_name.value = m.name;
                        fetch(`/api/version/${m.name}`)
                        .then(res => res.json())
                        .then(res => {
                            if (!res.success) {
                                document.getElementById('close-map-saver').click();
                            } else {
                                in_vers.value = res.version.substr(0, res.version.lastIndexOf('.')+1) + (+res.version.split('.')[res.version.split('.').length-1] + 1);
                                check_inputs();
                            }
                        });
                    };
                    target.appendChild(s);
                });

                let mnames = res.maps.map(m => m.name.toLowerCase()),
                    in_name = document.getElementById('map-saver-name'),
                    in_vers = document.getElementById('map-saver-version'),
                    emsg = document.getElementById('map-saver-err-content'),
                    wmsg = document.getElementById('map-saver-wrn-content');

                let show_err_msg = (msg, trgt) => {
                        sv_bt.classList.remove('warning');
                        sv_bt.classList.add('disabled');
                        trgt.classList.add('illegal');
                        emsg.parentElement.style.display = 'block';
                        emsg.innerHTML = msg;    
                    },
                    hide_err_msg = () => {
                        sv_bt.classList.remove('disabled');
                        in_name.classList.remove('illegal');
                        in_vers.classList.remove('illegal');
                        emsg.parentElement.style.display = 'none';    
                    };

                let show_wrn_msg = (msg, trgt) => {
                        sv_bt.classList.add('warning');
                        trgt.classList.add('warning');
                        wmsg.parentElement.style.display = 'block';
                        wmsg.innerHTML = msg;
                    },
                    hide_wrn_msg = () => {
                        sv_bt.classList.remove('warning');
                        in_name.classList.remove('warning');
                        in_vers.classList.remove('warning');
                        wmsg.parentElement.style.display = 'none';    
                    };

                let check_inputs = () => {
                    sv_bt.onclick = () => {};

                    hide_err_msg();
                    hide_wrn_msg();

                    if (in_name.value.match(/[^\w\d-]/g)) {
                        show_err_msg(`Kartenname darf nur aus Buchstaben, Zahlen, '_' und '-' bestehen!`, in_name);
                        return;
                    } else if (in_name.value.length > 64) {
                        show_err_msg(`Kartenname darf aus maximal 64 Zeichen bestehen!`, in_name);
                        return;
                    } else if (mnames.includes(in_name.value.toLowerCase())) {
                        show_wrn_msg(`Kartenname existiert bereits!`, in_name);
                    }
                    
                    if (in_vers.value.match(/[^\d.]/g)) {
                        show_err_msg(`Version darf nur aus Zahlen und Punkten bestehen!`, in_vers);
                        return;
                    } else if (in_vers.value.match(/\.\.+/g)) {
                        show_err_msg(`Version darf nicht zwei aufeinanderfolgende Punkte beinhalten!`, in_vers);
                        return;
                    } else if (in_vers.value.match(/(?:^\.|\.$)/g)) {
                        show_err_msg(`Version darf nicht mit einem Punkt beginnen oder enden!`, in_vers);
                        return;
                    }
                    
                    let actually_save = () => {
                        conf.map.version = in_vers.value;
                        update_map_description(in_name.value);
                        localStorage.setItem('map_name', in_name.value);
                        document.getElementById('close-map-saver').click();
                        show_loading();
                        mapi.save(`/api/map/${in_name.value}`, inc_v=false, () => {
                            stop_loading();
                        });
                        conf.tools.unsaved = false;
                    };
                    
                    if (in_name.value.length > 0 && in_vers.value.length > 0) {
                        if (mnames.includes(in_name.value.toLowerCase())) {
                            show_wrn_msg(`Kartenname existiert bereits!`, in_name);

                            fetch(`/api/version/${in_name.value}`)
                            .then(res => res.json())
                            .then(res => {
                                if (!res.success) {
                                    document.getElementById('close-map-saver').click();
                                } else if (window.compareVersions(res.version, in_vers.value) >= 0) {
                                    show_err_msg(`Version muss größer als aktuelle Version sein (${res.version})!`, in_vers);
                                    return;
                                } else {
                                    sv_bt.onclick = actually_save;
                                }
                            });
                        } else {
                            sv_bt.onclick = actually_save;
                        }
                    } else {
                        sv_bt.classList.remove('warning');
                        sv_bt.classList.add('disabled');
                    }
                };
                    
                in_name.onkeyup = check_inputs;
                in_vers.onkeyup = check_inputs;
            }
        });
    }
    document.getElementById('save-map-as').onclick = () => save_map_as();

    function save_map() {
        if (!localStorage.getItem('map_name')) {
            save_map_as();
        } else {
            show_loading();
            mapi.save(`/api/map/${localStorage.getItem('map_name')}`, true, () => {
                stop_loading();
            });
            update_map_description(localStorage.getItem('map_name'));
            conf.tools.unsaved = false;
        }
    }
    document.getElementById('save-map').onclick = () => save_map();

    function open_map(closeable=true) {
        document.getElementById('map-opener-back').style.display = 'block';
        let op_bt = document.getElementById('map-opener-open');
        op_bt.classList.add('disabled');
        op_bt.onclick = () => {};

        if (!closeable) {
            document.getElementById('close-map-opener').style.display = 'none';
        } else {
            document.getElementById('close-map-opener').style.display = 'block';
            document.getElementById('close-map-opener').onclick = () => {
                document.getElementById('map-opener-back').style.display = 'none';
            };
        }

        fetch('/api/maps')
        .then(res => res.json())
        .then(res => {
            if (!res.success) {
                window.location.assign('/');
            } else {
                let target = document.getElementById('map-opener-items');
                target.innerHTML = '';
                res.maps.forEach(m => {
                    let d = document.createElement('div');
                    d.classList.add('map-opener-item');
                    d.innerHTML = `<span>${m.name}</span><span>${format_date(new Date(m.timestamp))}</span>`;
                    d.onclick = () => {
                        new Array(...document.querySelectorAll('.map-opener-item.selected')).forEach(e => e.classList.remove('selected'));
                        d.classList.add('selected');
                        op_bt.classList.remove('disabled');
                        op_bt.onclick = () => {
                            show_loading();
                            mapi.load(`/api/map/${m.name}`, res => {
                                stop_loading();
                                if (!res.success) {
                                    open_map();
                                } else {
                                    document.getElementById('map-opener-back').style.display = 'none';
                                    update_map_description(m.name);
                                    localStorage.setItem('map_name', m.name);
                                }
                            });
                        };
                    };
                    target.appendChild(d);
                });
            }
        });
    }
    open_map(closeable=false);
    document.getElementById('open-map').onclick = () => open_map();

    window.onbeforeunload = e => {
        if (conf.tools.unsaved) {
            e.preventDefault();
            let msg = 'Die Karte könnte ungespeicherte Änderungen aufweisen. Sind Sie sicher, dass sie die Seite verlassen wollen?';
            (e || window.event).returnValue = msg;
            return msg;
        }
    };
};