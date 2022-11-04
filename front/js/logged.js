const getLogged = () => {
    return JSON.parse(localStorage.getItem('logged'))
}

const verify = async () => {
    let logged = await getLogged();

    if (logged == null) {
        window.location = 'login.html'
        return;
    }

    let authorization = `${logged.email}:${logged.password}`;
    let base64 = btoa(authorization);

    const response = await axios.get(`${ENDPOINT}/verify`, {
        headers: {
            Authorization: `Basic ${base64}`,
            'Cache-Control': 'no-store'
        }
    });

    const user = await response.data;

    if (!user) {
        window.location = 'login.html'
    }
    else {
        let loggeAt = new Date(user.loggedAt);
        let dataAtual = new Date();
    }
}

const out = () => {
    localStorage.removeItem('logged');
}

verify();