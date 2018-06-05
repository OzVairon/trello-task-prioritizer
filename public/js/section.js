/* global TrelloPowerUp */
let Promise = TrelloPowerUp.Promise;
let t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
//var arg = t.arg('arg');

// t.render(function(){

//   console.log('t.render')

//   t.card('attachments')
//   .get('attachments')
//   .filter(function(attachment){
//     return attachment.url.indexOf('https://trello.com/c/') == 0;
//   })
//   .then(function(yellowstoneAttachments){
//     var urls = yellowstoneAttachments.map(function(a){ return a.url; });
//     document.getElementById('urls').textContent = urls.join(', ');
//   })
//   .then(function(){
//     return t.sizeTo('#content');
//   });
//   //render_func()
// });


t.render(function render() {
  t.card('attachments')
    .get('attachments')
    .then(() => {
      console.log("HUI")
    })
});


function render_func() {

  console.log('render')

  console.log(t)

  console.log('promice object')
  console.log(t.card('attachments'))


  // .then(a => console.log("a: " + a))
  // .catch((err)=> {
  //     console.log('error')
  //     console.log(err)
  //   })  
  
  


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