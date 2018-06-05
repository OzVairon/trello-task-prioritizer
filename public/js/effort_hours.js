/* global TrelloPowerUp */

let Promise = TrelloPowerUp.Promise;
let t = TrelloPowerUp.iframe();

let field = document.getElementById('numeric_field');


t.render(function(){
  console.log('ready')
  console.log(t)
  console.log(t.getContext())
  console.log('ready end')
  return Promise.all([
    t.get('card', 'shared', key)
  ])
  .spread(function(data){
    if (data) field.value = data
    else field.value = 0;
    
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('card', 'shared', key, field.value)
  .then(function(){
      t.closePopup();
    }, function(err){
      console.log('rejected')
      alert(err.message)
    }
  )
})
