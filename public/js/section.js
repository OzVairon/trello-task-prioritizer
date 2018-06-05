/* global TrelloPowerUp */
var t 

// t.render(function render() {
//   t.card('attachments')
//     .get('attachments')
//     .then(() => {
//       console.log("HUI")
//     })
// });


document.addEventListener("DOMContentLoaded", function() {
  t = TrelloPowerUp.iframe();

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