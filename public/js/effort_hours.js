/* global TrelloPowerUp */

let Promise = TrelloPowerUp.Promise;
let t = TrelloPowerUp.iframe();




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

  let field = document.getElementById('numeric_field');
  
  t.get('card', 'shared', 'effort_hours')
  .then((hours)=>{
    console.log(field)
    if (data) field.value = data
    else field.value = 0;
  })
  .then(() => {
    t.sizeTo('#content')
    .done();
  })
});
s
document.getElementById('save').addEventListener('click', function(){
  console.log(t.getContext())
  let field = document.getElementById('numeric_field');
  return t.set('card', 'shared', 'effort_hours', field.value)
  .then(function(){
      t.closePopup();
    }, function(err){
      console.log('rejected')
      alert(err.message)
    }
  ).done();
})
