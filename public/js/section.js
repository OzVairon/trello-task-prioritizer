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
  //console.log('arguments')
  //console.log(arg)

  console.log(t.getContext())
  t.render(function render() {
    t.card('attachments')
    .get('attachments')
    .filter(function(attachment){
      let base = 'https://trello.com/c/';
      return (attachment.url.indexOf(base) == 0 && attachment.url.substring(base.length).length == 24);
    })
    .then(function(related){
      console.log(related)
      //create_card_view(related.name, related.url)
      related.forEach( c=> {
        create_card_view(c.name, c.id)
      })

      if (related.size === 0) {
        document.getElementById('related-card-list').appendChild(document.createElement('li').innerHTML('empty'));  
      }
      //var urls = related.map(function(a){ return a.url; });
      //document.getElementById('urls').textContent = urls.join(', ');
    })
    .then(function(){
      return t.sizeTo('#content');
    });
  });

  
  // console.log('ready')
  // console.log(t)
  // console.log(t.getContext())
  // console.log('ready end')
});

function create_card_view(name, id) {
  console.log(name, id)
  let card_html = (
    `<li class = ''>
        <div class ='card-back'>
          <div><span class='card-title'>${name}</span></div>
          <div><div class='delete-att-button'>x</div></div>
        </div>
    </li>`
  )

  var newNode = document.createElement('li');
  newNode.className = 'card-wrapper';
  newNode.innerHTML = card_html
  document.getElementById('related-card-list').appendChild(newNode);  

  newNode.addEventListener('click', function(){
    t.showCard(id)
  })
  
} 