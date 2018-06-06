/* global TrelloPowerUp */

let Promise = TrelloPowerUp.Promise;
let t = TrelloPowerUp.iframe();

let field = document.getElementById('numeric_field');


t.render(function(){
  
  // return Promise.all([
  //   t.get('card', 'shared', 'effort_hours')
  // ])
  // .spread(function(data){
  //   if (data) field.value = data
  //   else field.value = 0;
  // })
  // .then(function(){
  //   t.sizeTo('#content')
  //   .done();
  // })

  
  t.get('card', 'shared', 'effort_hours')
  .then((hours)=>{
    if (data) field.value = data
    else field.value = 0;
  })
  .then(() => {
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  console.log(t.getContext())
  return t.set('card', 'shared', 'effort_hours', field.value)
  .then(function(){
      t.closePopup();
    }, function(err){
      console.log('rejected')
      alert(err.message)
    }
  ).done();
})
