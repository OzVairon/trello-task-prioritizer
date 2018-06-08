function isAuth() {

}

function Authentificate() {

}

function isTrelloCardUrl(url) {
    let base = 'https://trello.com/c/';
    return (url.indexOf(base) == 0 && url.substring(base.length).length == 24);
}