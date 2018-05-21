/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var hoursField = document.getElementById('hours');


t.render(function(){
  return Promise.all([
    t.get('card', 'shared', 'fruit')
  ])
  .spread(function(hours_data){
    console.log(hours_data)
    if (hours_data) hoursField.value = hours_data
    else hoursField.value = 0;
    
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  console.log(hoursField.value)
  console.log(hoursField.value())
  console.log(hoursField.val())
  return t.set('card', 'shared', 'effort_hours', hoursField.value)
  .then(function(){
    t.closePopup();
  })
})
