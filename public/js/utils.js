function isAuth() {
    let token = Trello.token();
    console.log(Trello)
    if (token) {
        console.log(token)
        return true
    } else return false
}

function autorize() {
    let opts = {
    type: 'popup',
    name: 'TrelloTaskPrioritizer',
    scope: {
        read: true,
        write: true
    },
    expiration: 'never',
    success: (ut) => {
            console.log(isAuth())
        }
    }

    Trello.authorize(opts)
}

function deautorize() {
    Trello.deautorize()
}



function isTrelloCardUrl(url) {
    let base = 'https://trello.com/c/';
    return (url.indexOf(base) == 0 && url.substring(base.length).length == 24);
}