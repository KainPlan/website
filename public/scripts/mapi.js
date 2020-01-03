let mapi = {
    can: null,
    cab: null,
    ctx: null,

    conf: {
        scale: 0.5,
        min_scale: 0.15,
        max_scale: 1,
        ox: 0,
        oy: 0,
        map: {
            version: '0.0.1',
            nodes: [],
            beacons: [],
            width: 1820,
            height: 1280,
            background: {
                srcs: [
                    '/media/map_0.jpg',
                    '/media/map_1.png',
                ],
                objs: [],
            },
            current_floor: 0,
        },
        m2px: 5,
        clock_rate: 10, // [clock_rate] = Hz
        anim_time: 100,
        anim_intval: null,
    },
    zoom: (ds, cx, cy) => {
        let psc = mapi.conf.scale;

        mapi.conf.scale -= ds;
        mapi.conf.scale = Math.round(mapi.conf.scale * 100) / 100;

        if (mapi.conf.scale < mapi.conf.min_scale)
            mapi.conf.scale = mapi.conf.min_scale;
        else if (mapi.conf.scale > mapi.conf.max_scale)
            mapi.conf.scale = mapi.conf.max_scale;

        mapi.pan(
            ((cx - mapi.conf.ox) / psc) * mapi.conf.scale + mapi.conf.ox - cx,
            ((cy - mapi.conf.oy) / psc) * mapi.conf.scale + mapi.conf.oy - cy
        );
        mapi.refresh();
    },
    pan: (dx, dy) => {
        let nox = mapi.conf.ox - dx,
            noy = mapi.conf.oy - dy;

        if (nox > 0) {
            nox = 0;
        } else if (nox < Math.min(-mapi.conf.map.width * mapi.conf.m2px * mapi.conf.scale + mapi.can.width, 0)) {
            nox = Math.min(-mapi.conf.map.width * mapi.conf.m2px * mapi.conf.scale + mapi.can.width, 0);
        }

        if (noy > 0) {
            noy = 0;
        } else if (noy < Math.min(-mapi.conf.map.height * mapi.conf.m2px * mapi.conf.scale + mapi.can.height, 0)) {
            noy = Math.min(-mapi.conf.map.height * mapi.conf.m2px * mapi.conf.scale + mapi.can.height, 0);
        }

        dx = nox - mapi.conf.ox;
        dy = noy - mapi.conf.oy;

        mapi.ctx.translate(dx, dy);

        mapi.conf.ox = nox;
        mapi.conf.oy = noy;

        mapi.refresh();
    },
    pan_into_view: n => {
        window.clearInterval(mapi.conf.anim_intval);
        mapi.switch_to_floor(n.z);

        let i = 0,
            pdx = mapi.cab.width / 2 / mapi.conf.m2px / mapi.conf.scale,
            pdy = mapi.cab.height / 2 / mapi.conf.m2px / mapi.conf.scale,
            step_x = (n.x + mapi.conf.ox / mapi.conf.m2px / mapi.conf.scale - pdx) / mapi.conf.anim_time,
            step_y = (n.y + mapi.conf.oy / mapi.conf.m2px / mapi.conf.scale - pdy) / mapi.conf.anim_time;
        mapi.conf.anim_intval = window.setInterval(() => {
            if (i >= mapi.conf.anim_time) {
                window.clearInterval(mapi.conf.anim_intval);
            }
            mapi.pan(mapi.map_to_canv(step_x), mapi.map_to_canv(step_y));
            i++;
        }, 1);
    },
    canv_to_map: (x, y) => {
        return [
            (x - mapi.conf.ox) / mapi.conf.m2px / mapi.conf.scale,
            (y - mapi.conf.oy) / mapi.conf.m2px / mapi.conf.scale
        ];
    },
    map_to_canv: (u) => {
        return u * mapi.conf.m2px * mapi.conf.scale;
    },
    closest_node: (x, y, z) => {
        let closest = null,
            closest_dist = Infinity;
        mapi.conf.map.nodes[z].forEach(n => {
            let dist = Math.sqrt(Math.abs(x-n.x) + Math.abs(y-n.y));
            if (dist < closest_dist) {
                closest = n;
                closest_dist = dist;
            }
        });
        return closest;
    },
    switch_to_floor: fi => {
        if (fi >= mapi.conf.map.background.srcs.length || fi < 0) return;
        mapi.conf.map.current_floor = fi;
        mapi.refresh();
        mapi.on_floor_updated(fi);
    },
    on_floor_updated: fi => {
    },
    to_upper_floor: () => {
        mapi.switch_to_floor(mapi.conf.map.current_floor+1);
    },
    to_lower_floor: () => {
        mapi.switch_to_floor(mapi.conf.map.current_floor-1);
    },
    reconstruct_path: n => {
        if (n.pred) {
            return [...mapi.reconstruct_path(n.pred), mapi.inflate_node(n.pred)];
        }
        return [];
    },
    flatten_node: n => {
        return {
            id:     n.id,
            x:      n.x,
            y:      n.y,
            z:      n.z,
            edges:  n.edges,
        };
    },
    inflate_node: f => {
        return mapi.conf.map.nodes[f.z].filter(n => n.id === f.id)[0];
    },
    shortest_path: (start, finish) => {
        let open = [mapi.flatten_node(start)], closed = [];
        open[0].f = 0;
        open[0].g = 0;
        let q = null;

        while (open.length > 0) {
            let mini = 0;
            for (let i = 1; i < open.length; i++) {
                if (open[i].f < open[mini].f) mini = i;
            }
            q = open.splice(mini, 1)[0];

            for (let e of q.edges) {
                let n = mapi.flatten_node(e.to);
                n.pred = q;

                if (n.id === finish.id) {
                    return [...mapi.reconstruct_path(n), mapi.inflate_node(n)];
                }

                n.g = q.g + (e.length ? e.length : Math.sqrt(Math.abs(q.x - n.x) + Math.abs(q.y - n.y)));
                n.h = Math.sqrt(Math.abs(finish.x - n.x) + Math.abs(finish.y - n.y));
                n.f = n.g + n.h;

                let moi = open.map(x => x.id).indexOf(n.id),
                    mci = closed.map(x => x.id).indexOf(n.id);

                if (moi === -1 && mci === -1) {
                    open.push(n);
                } else if (moi >= 0 && open[moi].f > n.f) {
                    open[moi] = n;
                } else if (mci >= 0 && closed[mci].f > n.f) {
                    open.push(n);
                    closed.splice(mci, 1);
                }
            }
            
            closed.push(q);
        }
    },
    draw_node: (n, stroke=null, fill=null) => {
        if (n.z !== mapi.conf.map.current_floor)
            return;
        mapi.ctx.beginPath();
        mapi.ctx.lineWidth = 5 * mapi.conf.scale;
        mapi.ctx.strokeStyle = stroke || n.stroke;
        mapi.ctx.fillStyle = fill || n.fill;
        mapi.ctx.ellipse(mapi.map_to_canv(n.x),
            mapi.map_to_canv(n.y),
            mapi.map_to_canv(n.radius),
            mapi.map_to_canv(n.radius),
            0, 0, 2 * Math.PI);
        mapi.ctx.stroke();
        mapi.ctx.fill();
    },
    icon_buffer: {
    },
    draw_node_icon: (n, icon) => {
        if (n.z !== mapi.conf.map.current_floor)
            return;

        let ic = mapi.icon_buffer[icon];
        let draw = () => {
            mapi.ctx.drawImage(ic, 
                mapi.map_to_canv(n.x) - mapi.map_to_canv(n.radius), 
                mapi.map_to_canv(n.y) - mapi.map_to_canv(n.radius), 
                mapi.map_to_canv(n.radius*2), 
                mapi.map_to_canv(n.radius*2)
            );
            mapi.icon_buffer[icon] = ic;
        };
        if (!ic) {
            ic = new Image();
            ic.onload = draw;
            ic.src = icon;
        }
        else {
            draw();
        }
    },
    connect_nodes: (n1, n2, c='#622dff') => {
        if (n1.z !== n2.z || n1.z !== mapi.conf.map.current_floor)
            return;
        mapi.ctx.beginPath();
        mapi.ctx.strokeStyle = c;
        mapi.ctx.moveTo(mapi.map_to_canv(n1.x), mapi.map_to_canv(n1.y));
        mapi.ctx.lineTo(mapi.map_to_canv(n2.x), mapi.map_to_canv(n2.y));
        mapi.ctx.stroke();
    },
    draw_route: (r, c='#622dff') => {
        // mapi.draw_node(r[0]);
        // mapi.draw_node(r.slice(-1)[0]);
        r.filter(n => n instanceof StairsNode).forEach(mapi.draw_node);
        mapi.ctx.beginPath();
        mapi.ctx.lineWidth = 4;
        mapi.ctx.lineCap = 'round';
        mapi.ctx.strokeStyle = c;
        for (let i = 0; i < r.length-1; i++) {
            if (r[i].z !== r[i+1].z || r[i].z !== mapi.conf.map.current_floor) continue;
            mapi.ctx.moveTo(mapi.map_to_canv(r[i].x), mapi.map_to_canv(r[i].y));
            mapi.ctx.lineTo(mapi.map_to_canv(r[i+1].x), mapi.map_to_canv(r[i+1].y));
        }
        mapi.ctx.stroke();
    },
    mouse_ev: {
        p_list: [],
        prev_x: -1,
        prev_y: -1,

        rm_event: e => {
            for (let i = 0; i < mapi.mouse_ev.p_list.length; i++) {
                if (mapi.mouse_ev.p_list[i].pointerId === e.pointerId) {
                    mapi.mouse_ev.p_list.splice(i, 1);
                    break;
                }
            }
            mapi.mouse_ev.reset();
        },

        reset: () => {
            mapi.mouse_ev.prev_x = -1;
            mapi.mouse_ev.prev_y = -1;
        },
        reset_all: () => {
            mapi.mouse_ev.p_list = [];
            mapi.mouse_ev.reset();
        },

        on_zoom: e => {
            if (!(mapi.conf.scale === mapi.conf.max_scale && mapi.conf.deltaY < 0)) {
                e.preventDefault();
                mapi.zoom(e.deltaY < 0 ? -0.05 : 0.05, e.clientX - mapi.cab.left, e.clientY - mapi.cab.top);
            }
        },
        on_mousedown: e => {
            mapi.mouse_ev.p_list.push(e);
        },
        on_mousemove: e => {
            for (let i = 0; i < mapi.mouse_ev.p_list.length; i++) {
                if (mapi.mouse_ev.p_list[i].pointerId === e.pointerId) {
                    mapi.mouse_ev.p_list[i] = e;
                    break;
                }
            }

            if (mapi.mouse_ev.p_list.length === 1) {
                let c_x = e.clientX,
                    c_y = e.clientY;

                if (mapi.mouse_ev.prev_x >= 0) {
                    let mov_x = mapi.mouse_ev.prev_x - c_x,
                        mov_y = mapi.mouse_ev.prev_y - c_y;
                    mapi.pan(mov_x, mov_y);
                }

                mapi.mouse_ev.prev_x = c_x;
                mapi.mouse_ev.prev_y = c_y;
            }
        },
        on_mouseup: e => {
            mapi.mouse_ev.rm_event(e);
        },
    },
    touch_ev: {
        p_list: [],
        prev_diff: -1,
        prev_x: -1,
        prev_y: -1,

        rm_event: e => {
            for (let i = 0; i < mapi.touch_ev.p_list.length; i++) {
                if (mapi.touch_ev.p_list[i].pointerId === e.pointerId) {
                    mapi.touch_ev.p_list.splice(i, 1);
                    break;
                }
            }
            mapi.touch_ev.reset();
        },

        reset: () => {
            mapi.touch_ev.prev_diff = -1;
            mapi.touch_ev.prev_x = -1;
            mapi.touch_ev.prev_y = -1;
        },
        reset_all: () => {
            mapi.touch_ev.p_list = [];
            mapi.touch_ev.reset();
        },

        on_pointerdown: e => {
            mapi.touch_ev.p_list.push(e);
        },
        on_pointermove: e => {
            for (let i = 0; i < mapi.touch_ev.p_list.length; i++) {
                if (mapi.touch_ev.p_list[i].pointerId === e.pointerId) {
                    mapi.touch_ev.p_list[i] = e;
                    break;
                }
            }

            if (mapi.touch_ev.p_list.length === 2) {
                let x0 = mapi.touch_ev.p_list[0].clientX,
                    x1 = mapi.touch_ev.p_list[1].clientX,
                    y0 = mapi.touch_ev.p_list[0].clientY,
                    y1 = mapi.touch_ev.p_list[1].clientY

                let dx = Math.abs(x0 - x1),
                    dy = Math.abs(y0 - y1),
                    curr_diff = Math.max(dx, dy);

                if (mapi.touch_ev.prev_diff >= 0 && !(mapi.conf.scale === mapi.conf.max_scale && mapi.conf.deltaY < 0)) {
                    let comp_diff = mapi.touch_ev.prev_diff - curr_diff;
                    mapi.zoom(comp_diff * 0.02,
                        Math.min(x0, x1) - mapi.cab.left + dx / 2,
                        Math.min(y0, y1) - mapi.cab.top + dy / 2);
                }

                mapi.touch_ev.prev_diff = curr_diff;
            } else if (mapi.touch_ev.p_list.length === 1) {
                let c_x = e.clientX,
                    c_y = e.clientY;

                if (mapi.touch_ev.prev_x >= 0) {
                    let mov_x = mapi.touch_ev.prev_x - c_x,
                        mov_y = mapi.touch_ev.prev_y - c_y;
                    mapi.pan(mov_x, mov_y);
                }

                mapi.touch_ev.prev_x = c_x;
                mapi.touch_ev.prev_y = c_y;
            }
        },
        on_pointerup: e => {
            mapi.touch_ev.rm_event(e);
        },
    },
    refresh: () => {
        mapi.ctx.clearRect(0, 0, mapi.can.width + mapi.conf.map.width * mapi.conf.m2px * mapi.conf.scale,
            mapi.can.height + mapi.conf.map.height * mapi.conf.m2px * mapi.conf.scale);
        mapi.ctx.drawImage(mapi.conf.map.background.objs[mapi.conf.map.current_floor], 0, 0,
            mapi.conf.map.width * mapi.conf.m2px * mapi.conf.scale,
            mapi.conf.map.height * mapi.conf.m2px * mapi.conf.scale);
    },
    
    load: (url, cb=()=>{}) => {
        fetch(url).then(res => res.json()).then(res => {
            if (res.success) {
                res.map.nodes.forEach(f => {
                    for (let j = 0; j < f.length; j++) {
                        let n = f[j],
                            temp;
                        switch(n.id.split(';')[0]) {
                            case 'e':
                                temp = new EndNode(n.x, n.y, n.z, n.title, n.desc);
                            break;
                            case 's':
                                temp = new StairsNode(n.x, n.y, n.z);
                                temp.stairs = n.stairs;
                            break;
                            default:
                                temp = new Node(n.x, n.y, n.z);
                            break;
                        }
                        temp.edges = n.edges;
                        f[j] = temp;
                    }
                });
                res.map.nodes.forEach(f => {
                    for (let j = 0; j < f.length; j++) {
                        let n = f[j],
                            rmi = [];
   
                        if (n instanceof StairsNode) {
                            let tn = res.map.nodes[n.stairs.to.split(';')[3]].filter(x => x.id === n.stairs.to)[0];
                            if (tn) f[j].stairs = new Edge(tn, n.stairs.length);
                        }

                        for (let i = 0; i < n.edges.length; i++) {
                            let tf = +n.edges[i].to.split(';')[3];
                            if (tf !== n.z) {
                                if (n instanceof StairsNode) n.edges[i] = n.stairs;
                                else rmi.push(i);
                                continue;
                            }

                            let tn = res.map.nodes[tf].filter(x => x.id === n.edges[i].to)[0];
                            if (!tn) rmi.push(i);
                            else n.edges[i] = new Edge(tn, n.edges[i].length);
                        }
                        rmi.forEach(i => {
                            n.edges.splice(i, 1);
                        });
                    }
                });

                mapi.conf.map = res.map;
                mapi.init();
            } else {
                window.alert('Diese Karte existiert leider nicht!');
            }
            cb(res);
        });
    },
    save: (url, inc_v=true, cb=()=>{}) => {
        let v = mapi.conf.map.version;
        if (inc_v) {
            mapi.conf.map.version = v.substr(0, v.lastIndexOf('.')+1) + (+v.split('.')[v.split('.').length-1] + 1);
        }
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                map: mapi.conf.map,
            }, (k, v) => {
                if (k === 'to' && v instanceof Node) {
                    return v.id;
                } else if (k === 'objs' && v instanceof Array) {
                    return [];
                } else {
                    return v;
                }
            }),
        })
        .then(res => res.json())
        .then(res => {
            if (!res.success)
                window.alert('An error occurred!');
            cb(res);
        });
    },
    init: cb => {
        for (let i = 0; i < mapi.conf.map.background.srcs.length; i++) {
            mapi.conf.map.background.objs.push(new Image());
        }

        mapi.conf.map.background.objs[0].onload = () => {
            window.onresize();

            mapi.can.onwheel = mapi.mouse_ev.on_zoom;
            mapi.can.onmousedown = mapi.mouse_ev.on_mousedown;
            mapi.can.onmousemove = mapi.mouse_ev.on_mousemove;
            mapi.can.onmouseup = mapi.mouse_ev.on_mouseup;
            mapi.can.onmouseleave = mapi.mouse_ev.on_mouseup;
            mapi.can.onmouseout = mapi.mouse_ev.on_mouseup;
            
            mapi.can.onpointerdown = mapi.touch_ev.on_pointerdown;
            mapi.can.onpointermove = mapi.touch_ev.on_pointermove;
            mapi.can.onpointerup = mapi.touch_ev.on_pointerup;
            mapi.can.onpointercancel = mapi.touch_ev.on_pointerup;
            mapi.can.onpointerout = mapi.touch_ev.on_pointerup;
            mapi.can.onpointerleave = mapi.touch_ev.on_pointerup;
        }

        for (let [i, src] of mapi.conf.map.background.srcs.entries()) {
            mapi.conf.map.background.objs[i].src = src;
        }

        if (cb) cb();
    },
};