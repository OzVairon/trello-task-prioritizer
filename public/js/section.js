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
      return (attachment.url.indexOf('https://trello.com/c/') == 0 && attachment.url.substring(base.length).length === 24);
    })
    .then(function(related){

      create_card_view(related.name, related.url)
      //var urls = related.map(function(a){ return a.url; });
      //document.getElementById('urls').textContent = urls.join(', ');
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

function create_card_view(name, url) {

  let card_html = (
    `<li class = ''>
      <a href = '${url}'>
        <div class ='card-back'>
          <div><span class='card-title'>${name}</span></div>
          <div><div class='delete-att-button'>x</div></div>
        </div>
      </a>
    </li>`
  )

  var newNode = document.createElement('li');
  newNode.className = 'card-wrapper';
  newNode.innerHTML = card_html
  document.getElementById('related-card-list').appendChild(newNode);  
  
} 