function isAuth() {
    let token = Trello.token;
    console.log(Trello)
    if (token) {
        console.log(token)
        return true
    } else return false
}

function Authentificate() {

}

function isTrelloCardUrl(url) {
    let base = 'https://trello.com/c/';
    return (url.indexOf(base) == 0 && url.substring(base.length).length == 24);
}