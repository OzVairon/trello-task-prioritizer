/* global TrelloPowerUp */
var t = TrelloPowerUp.iframe();
var arg = t.arg('arg');
// t.render(function render() {
//   t.card('attachments')
//     .get('attachments')
//     .then(() => {
//       console.log("HUI")
//     })
// });


document.addEventListener("DOMContentLoaded", function() {
//  t = TrelloPowerUp.iframe();
  console.log('arguments')
  console.log(arg)
  t.render(function render() {
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
  });

  
  console.log('ready')
  console.log(t)
  console.log(t.getContext())
  console.log('ready end')
});