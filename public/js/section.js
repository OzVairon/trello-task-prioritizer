/* global TrelloPowerUp */
let t = TrelloPowerUp.iframe();
console.log(t.getContext())
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
}