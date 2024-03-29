module.exports = {
    route: 'spotify',
    options: {
        url: "https://accounts.spotify.com/api/token?grant_type=client_credentials",
        file: "data/spotify.json",
        method: 'POST',
        headers: {
            'Authorization': 'Basic Y2I0MDU5M2ZkYjQ3NGIyZWJkNTM5NjBkN2RhZTBiZDE6MGM4MzE4M2ExZDFmNGUwNTg5Mjk3ZjdkZjQ4MTk5Y2M='
        },
        middleCallback: data => parseData(data),
        //callback: data => res.json(data)
    }
}

let parseData = token => {
    axios({
        method: "GET",
        url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj',
        headers: {
            'Authorization': 'Bearer ' + token.access_token
        }
    })
        .then(response => {
            res.json(response.data)
        })
        .catch(err => {
            res.json(err)
        });
}