const API_KEY = '1bd6eb54b14babeeb34032a923075fbb'

function isAuth(t) {
    return t.get('member', 'private', 'token')
    .then(function(token){
        if(token){
            return { authorized: true };
        }
        return { authorized: false };
    });
}

function autorize(t) {
    console.log('try to authorize')
    let trelloAPIKey = API_KEY;
    if (trelloAPIKey) {
        console.log('i have an api key')
      return t.popup({
        title: 'Authentification',
        args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
        url: BASE_URL + 'views/authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 200,
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
}


function doIfAuth(t, callback) {
    return isAuth(t).then((auth_data) => {
        if (auth_data.authorized) {
            console.log('good')
            return callback(t);
        } else {
            console.log('fail')
            return autorize(t)
        }
      })
}


function isTrelloCardUrl(url) {
    let base = 'https://trello.com/c/';
    return (url.indexOf(base) == 0 && url.substring(base.length).length == 24);
}

window.utils = {
    isAuth: isAuth,
    autorize: autorize,
    isTrelloCardUrl: isTrelloCardUrl,
    doIfAuth: doIfAuth
}