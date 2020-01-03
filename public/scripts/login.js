window.onload = () => {
    document.getElementById('login-form').onsubmit = e => {
        e.preventDefault();

        let uname = document.getElementById('user').value, 
            pwd = document.getElementById('pwd').value;

        if (uname.trim() === '' || pwd.trim() === '') {
            document.getElementById('log_msg').innerHTML = 'Missing username and/or password!';
        } else {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uname: uname,
                    pwd: pwd,
                }),
            })
            .then(res => res.json())
            .then(res => {
                if (res.success)
                    window.location.assign('/map');
                else
                    document.getElementById('log_msg').innerHTML = res.msg;
            });
        }
    };
};