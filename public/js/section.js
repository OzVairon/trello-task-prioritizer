/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var arg = t.arg('arg');

t.render(function(){
  render_func()
});


function render_func() {


  t.card('attachments')
  .get('attachments')
  .filter(function(attachment){
    return attachment.url.indexOf('https://trello.com/c/') == 0;
  })
  .then(function(yellowstoneAttachments){
    var urls = yellowstoneAttachments.map(function(a){ return a.url; });
    document.getElementById('urls').textContent = urls.join(', ');
  })
  .then(function(){
    return t.sizeTo('#content');
  });


  // console.log('attachment render')
  // console.log(t)
  
  // console.log(t.card('all'));

  // Promise.resolve(t.card('all'))
  //   .then(function () {
  //     console.log('hui');
  //   })
  //   .catch((err) => {
  //     console.log(err.statusText)
  //   })
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
  console.log('attachment ready')
  render_func()
});