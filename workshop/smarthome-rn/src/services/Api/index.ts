const apiUrl = 'https://senseboxdev-dot-bto1-185908.appspot.com'


function registerSensebox(uuid: string): void {
    fetch(api('/senseboxes'), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify({
            uuid: uuid
        })
    });
}

function api(path: string): string {
    return apiUrl + "/admin" + path;
}

export { registerSensebox };
