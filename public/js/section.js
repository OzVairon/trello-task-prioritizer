/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var arg = t.arg('arg');

t.render(function(){
  render_func()
});


function render_func() {
  console.log('attachment render')
  console.log(t)
  // make sure your rendering logic lives here, since we will
  // recall this method as the user adds and removes attachments
  // from your section
  console.log(t.card('all'));

  Promise.resolve(t.card('all'))
    .then(function (card) {
      console.log(card);
    })
    .catch((err) => {
      console.log(err.statusText)
    })
  // .get('attachments')
  // .filter(function(attachment){
  //   console.log(attachment)
  //   return attachment.url.indexOf('https://trello.com/c/') == 0;
  // })
  // .then(function(cards){
  //   console.log(cards)
  //   var urls = cards.map(function(a){ return a.url; });
  //   document.getElementById('urls').textContent = urls.join(', ');
  // })
  // .then(function(){
  //   return t.sizeTo('#content');
  // });
}

document.addEventListener("DOMContentLoaded", function(event) { 
  render_func()
  console.log('attachment ready')
});