window.onload = () => {
    let sb = document.getElementById('sidebar'),
        sbb = document.getElementById('sb-back'),
        sb_intval = null, 
        sb_dur = 80;

    let si = document.getElementById('search-in'),
        clear_si = document.getElementById('clear-search-in'),
        suggs = document.getElementById('nav-results'),
        nav_container = document.getElementsByClassName('nav-container')[0];

    si.value = '';

    mapi.can = document.getElementById('main-canvas');
    mapi.ctx = mapi.can.getContext('2d');
    mapi.cab = mapi.can.getBoundingClientRect();

    function on_mobile() {
        return window.innerWidth <= 600;
    }

    function get_floor_name(fi) {
        return fi == 0 ? 'Erdgeschoss' : fi + '. Stock';
    }

    let nav_from = document.getElementById('nav-from'),
        close_nav_from = document.getElementById('close-nav-from'),
        from_in = document.getElementById('from-in'),
        clear_from_in = document.getElementById('clear-from-in'),
        pick_from = document.getElementById('pick-from');

    nav_from.value = '';

    close_nav_from.onclick = () => {
        nav_from.style.display = 'none';
        from_in.value = '';
        n_from = null;
        n_route = null;
        mapi.refresh();
    };

    pick_from.onclick = () => {
        
    };

    function route_clicked(e) {
        e.stopPropagation();
        nav_from.style.display = 'flex';
    }

    let pc = document.getElementById('point-container'),
        pcm = document.getElementById('point-container-mb'),
        pt = document.getElementById('point-title'),
        ptm = document.getElementById('point-title-mb'),
        pf = document.getElementById('point-floor'),
        pfm = document.getElementById('point-floor-mb'),
        pd = document.getElementById('point-desc'),
        route = document.getElementById('route'),
        routem = document.getElementById('route-mb'),
        close_pc = document.getElementById('close-point-container');

    let floors_container = document.getElementById('floors-container');

    function show_extended_point_info(n) {
        mapi.pan_into_view(n);
        pcm.style.display = 'none';
        pc.style.display = 'flex';
        pc.style.width = nav_container.getBoundingClientRect().width + 50 + 'px';
        pt.innerHTML = n.title;
        pf.innerHTML = get_floor_name(n.z);
        pd.innerHTML = n.desc;
        route.onclick = route_clicked;
        close_pc.onclick = () => {
            pc.style.display = 'none';
            pcm.style.display = 'flex';
        };
    }
    
    function display_point_info(n) {
        mapi.pan_into_view(n);
        pc.style.display = 'none';
        pcm.style.display = 'flex';
        ptm.innerHTML = n.title;
        pfm.innerHTML = get_floor_name(n.z);
        routem.onclick = route_clicked;
        pcm.onclick = () => show_extended_point_info(n);
    }

    function hide_point_info() {
        pc.style.display = 'none';
        pcm.style.display = 'none';
        route.onclick = () => {};
        routem.onclick = () => {};
        pcm.onclick = () => {};
    }

    function show_loading() {
        sbb.style.display = 'flex';
        document.getElementById('loading').style.display = 'flex';
    }
    
    function stop_loading() {
        sbb.style.display = 'none';
        document.getElementById('loading').style.display = 'none';
    }

    document.getElementById('open-sidebar').onclick = () => {
        window.clearInterval(sb_intval);
        sb.style.display = 'block';
        sb.style.left = -sb.getBoundingClientRect().width - 200 + 'px';
        sbb.style.display = 'flex';

        let i = 0, l = +sb.style.left.replace('px', ''),
            p = -l / sb_dur;
        sb_intval = window.setInterval(() => {
            if (i >= sb_dur-1) {
                window.clearInterval(sb_intval);
            }
            l += p;
            sb.style.left = l + 'px';
            i++;
        }, 1);
    };

    document.getElementById('close-sidebar').onclick = () => {
        window.clearInterval(sb_intval);
        sb.style.display = 'block';
        sb.style.left = '0';

        let i = 0, l = 0,
            p = (sb.getBoundingClientRect().width + 200) / sb_dur;
        sb_intval = window.setInterval(() => {
            if (i >= sb_dur-1) {
                window.clearInterval(sb_intval);
                sbb.style.display = 'none';
                sb.style.display = 'none';
            }
            l -= p;
            sb.style.left = l + 'px';
            i++;
        }, 1);
    };

    window.onresize = () => {
        mapi.can.width = window.innerWidth - 2;
        mapi.can.height = Math.min(window.innerHeight, mapi.conf.map.height * mapi.conf.m2px);

        mapi.conf.ox = 0;
        mapi.conf.oy = 0;

        mapi.cab = mapi.can.getBoundingClientRect();
        mapi.refresh();
    };

    let n_from = null,
        n_to = null,
        n_route = null;

    function refresh() {
        mapi.ctx.clearRect(0, 0, mapi.can.width + mapi.conf.map.width * mapi.conf.m2px * mapi.conf.scale,
            mapi.can.height + mapi.conf.map.height * mapi.conf.m2px * mapi.conf.scale);
        mapi.ctx.drawImage(mapi.conf.map.background.objs[mapi.conf.map.current_floor], 0, 0,
            mapi.conf.map.width * mapi.conf.m2px * mapi.conf.scale,
            mapi.conf.map.height * mapi.conf.m2px * mapi.conf.scale);

        if (n_route) mapi.draw_route(n_route, '#2DFFBC');
        if (n_from) mapi.draw_node(n_from, '#C324FF', 'rgba(195, 36, 255, .2)');
        if (n_to) mapi.draw_node(n_to);
    }
    mapi.refresh = refresh;

    function route_if_possible () {
        if (n_from && n_to) {
            n_route = mapi.shortest_path(n_from, n_to);
        }
    }

    let suggs_anim_time = 45,
        suggs_anim_intval = null;

    function show_suggs(k, trgt, exc, cb=()=>{}) {
        let end_nodes = mapi.conf.map.nodes.flat().filter(n => n instanceof EndNode);
        suggs.innerHTML = '';
        end_nodes.filter(n => n.title.toLowerCase().startsWith(k.toLowerCase()) && !exc.includes(n.id)).slice(0, 5).forEach(n => {
            let d = document.createElement('div');
            d.classList.add('nav-res');
            let desc = '';
            for (let w of n.desc.split(' ')) {
                if ((desc + ' ' + w).length > 64)
                    break;
                desc += ' ' + w;
            }
            d.innerHTML = `
                <h3><span class="match">${n.title.substr(0, k.length)}</span>${n.title.substr(k.length)}</h3>
                <p>${n.desc.length > 64 ? desc + ' ...' : desc}</p>
            `;
            d.onclick = () => {
                trgt.parentElement.getElementsByTagName('label')[0].classList.add('label-top');
                trgt.value = n.title;
                cb(n);
            };
            suggs.appendChild(d);
        });
    }

    function anim_suggs_in(cb=()=>{}) {
        window.clearInterval(suggs_anim_intval);

        suggs.style.maxHeight = '100%';
        let i = 0,
            curr_h = 0,
            step = suggs.getBoundingClientRect().height / suggs_anim_time;
        suggs.style.maxHeight = 0;

        suggs_anim_intval = window.setInterval(() => {
            if (i >= suggs_anim_time) {
                suggs.style.maxHeight = '100%';
                window.clearInterval(suggs_anim_intval);
                cb();
                return;
            }
            curr_h += step;
            suggs.style.maxHeight = curr_h + 'px';
            i++;
        }, 1);
    }

    function anim_suggs_out(cb=()=>{}) {
        window.clearInterval(suggs_anim_intval);

        let i = 0,
            curr_h = suggs.getBoundingClientRect().height
            step = curr_h / suggs_anim_time;
        suggs.maxHeight = curr_h + 'px';

        window.setTimeout(() => {
            suggs_anim_intval = window.setInterval(() => {
                if (i >= suggs_anim_time) {
                    suggs.style.maxHeight = 0;
                    window.clearInterval(suggs_anim_intval);
                    cb();
                    return;
                }
                curr_h -= step;
                suggs.style.maxHeight = curr_h + 'px';
                i++;
            }, 1);
        }, 50);
    }

    mapi.on_floor_updated = fi => {
        window.setTimeout(() => stop_loading(), 100);
        floors_container.querySelector('i.current').classList.remove('current');
        [...floors_container.getElementsByTagName('i')].reverse()[fi].classList.add('current');
    };

    show_loading();
    mapi.load('/api/map', res => {
        if (res.success) window.setTimeout(() => {
            stop_loading();
            sbb.onclick = () => document.getElementById('close-sidebar').click();

            floors_container.innerHTML = '';

            for (let j = res.map.background.srcs.length-1; j >= 0; j--) {
                let i = document.createElement('i');
                if (j === mapi.conf.map.current_floor)
                    i.classList.add('current');
                i.onclick = () => {
                    show_loading();
                    mapi.switch_to_floor(j);
                };
                
                floors_container.appendChild(i);
            }

            si.onfocus = () => {
                anim_suggs_in(() => {
                    document.getElementById('open-sidebar').style.display = 'none';
                    document.getElementById('search').style.display = 'none';
                });
                show_suggs(si.value, si, [n_from ? n_from.id : null], n => {
                    n_to = n;
                    mapi.refresh();
                    display_point_info(n);
                    route_if_possible();
                });
            }
            from_in.onfocus = () => {
                anim_suggs_in(() => {
                    document.getElementById('close-nav-from').style.display = 'none';
                    document.getElementById('pick-from').style.display = 'none';
                });
                show_suggs(from_in.value, from_in, [n_to ? n_to.id : null], n => {
                    n_from = n;
                    mapi.refresh();
                    mapi.pan_into_view(n);
                    route_if_possible();
                });
            }
            si.onblur = () => {
                window.setTimeout(() => {
                    if (![from_in, clear_si, clear_from_in].includes(document.activeElement)) {
                        anim_suggs_out(() => {
                            document.getElementById('open-sidebar').style.display = 'inherit';
                            document.getElementById('search').style.display = 'inherit';
                        });
                    }
                }, 50);
            }
            from_in.onblur = () => {
                window.setTimeout(() => {
                    if (![si, clear_from_in, clear_si].includes(document.activeElement)) {
                        anim_suggs_out(() => {
                            document.getElementById('close-nav-from').style.display = 'inherit';
                            document.getElementById('pick-from').style.display = 'inherit';
                        });
                    }
                }, 50);
            }

            function check_si(e={keyCode:0,}) {
                if (si.value.length > 0) {
                    si.parentElement.getElementsByTagName('label')[0].classList.add('label-top');
                } else {
                    si.parentElement.getElementsByTagName('label')[0].classList.remove('label-top');
                }
                
                n_to = null;
                n_route = null;
                hide_point_info();
                mapi.refresh();

                switch (e.keyCode) {
                    case 13:
                    case 27:
                        si.blur();
                    break;
                }

                show_suggs(si.value, si, [n_from ? n_from.id : null], n => {
                    n_to = n;
                    mapi.refresh();
                    display_point_info(n);
                    route_if_possible();
                });
            }

            function check_from_in(e={keyCode:0,}) {
                if (from_in.value.length > 0) {
                    from_in.parentElement.getElementsByTagName('label')[0].classList.add('label-top');
                } else {
                    from_in.parentElement.getElementsByTagName('label')[0].classList.remove('label-top');
                }

                n_from = null;
                n_route = null;
                mapi.refresh();

                switch (e.keyCode) {
                    case 13:
                    case 27:
                        from_in.blur();
                    break;
                }

                show_suggs(from_in.value, from_in, [n_to ? n_to.id : null], n => {
                    n_from = n;
                    mapi.refresh();
                    mapi.pan_into_view(n);
                    route_if_possible();
                });
            }

            clear_si.onclick = () => {
                si.value = '';
                check_si();
                si.focus();
            }

            clear_from_in.onclick = () => {
                from_in.value = '';
                check_from_in();
                from_in.focus();
            }
        
            si.onkeyup = check_si;
            from_in.onkeyup = check_from_in;
        
            document.getElementById('search').onclick = () => {
                si.focus();
            };

            pick_from.onclick = () => {
            };
        }, 150);
    });
};