window.onload = () => {
    let h1 = document.getElementById('main-title'),
            typer = new TenFingers(h1, {
                loop: true,
                typingSpeed: 225,
                endTimeout: 500,
            }).clear().type('KainPlan').pause(10000).clear();
    
    document.getElementById('scroll-top-main').onclick = () => {
        document.getElementById('top-quote').scrollIntoView({
            behavior: 'smooth',
        });
    };
    
    let prev = window.scrollY,
        header = document.getElementsByTagName('header')[0];
    window.onscroll = e => {
        let diff = window.scrollY - prev;
        
        if (diff < 0 || window.scrollY == 0 || window.scrollY + window.innerHeight >= document.body.offsetHeight) {
            header.style.top = '0px';
        } else {
            header.style.top = +header.style.top.replace('px', '') - diff + "px";
        }
        
        prev = window.scrollY;
    };
};