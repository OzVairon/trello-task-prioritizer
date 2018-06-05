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
      .then(() => {
        console.log("HUI")
      })
  });

  
  console.log('ready')
  console.log(t)
  console.log(t.getContext())
  console.log('ready end')
});