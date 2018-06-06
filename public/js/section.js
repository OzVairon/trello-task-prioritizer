/* global TrelloPowerUp */
var t = TrelloPowerUp.iframe();
var arg = t.arg('arg');


t.render(function render() {
  t.card('attachments')
  .get('attachments')
  .filter(function(attachment){
    let base = 'https://trello.com/c/';
    return (attachment.url.indexOf(base) == 0 && attachment.url.substring(base.length).length == 24);
  })
  .then(function(related){
    t.cards('all').then( (cards) => {
      document.getElementById('related-card-list').innerHTML = ""
      related.forEach( rc => {
        console.log('p1')
        console.log(rc)
        let theCard = cards.filter((e) => {return e.id == rc.name})[0]
        if (theCard) {
          console.log('p2.1')
          console.log(rc)

          create_card_view(theCard.name, theCard.id, rc.id)
        }
        else {
          console.log('p2.2')
          create_card_view(rc.name, rc.name, rc.id)
        }
      })

      if (related.size === 0) {
        document.getElementById('related-card-list').appendChild(document.createElement('li').innerHTML('empty'));  
      }
    })
    .then(function(){
      return t.sizeTo('#content');
    })
  })
  .catch(() => console.log(t.getContext()))
});


function create_card_view(name, card_id, att_id) {

  console.log('1')
  let card_html = (
    `<div class ='card-back'>
      <div><span class='card-title'>${name}</span></div>
        <button class='delete-att-button'>x</button> 
    </div>`
  )

  var newNode = document.createElement('li');
  newNode.className = 'card-wrapper';
  newNode.innerHTML = card_html

  console.log('2')
  document.getElementById('related-card-list').appendChild(newNode);  
  newNode.addEventListener('click', function(){
    t.showCard(card_id)
  })
  console.log('3')
  // newNode.getElementsByClassName('delete-att-button')[0].addEventListener('click', function(){
  //   t.card('id').then(s_card_id => {
  //     console.log(s_card_id)
  //     console.log(att_id)
  //     delete_attachment(s_card_id.id, att_id)
  //   })
  // })
} 

function delete_attachment(card_id, att_id) {
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
    }
  });
  xhr.open("DELETE", `https://api.trello.com/1/cards/${card_id}/attachments/${att_id}`);
  xhr.send(data);
}