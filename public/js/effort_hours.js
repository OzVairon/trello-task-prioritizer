/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var hoursField = document.getElementById('hours');


t.render(function(){
  return Promise.all([
    t.get('card', 'shared', 'effort_hours')
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
  let data = ''
  for (let i = 0; i < 4090; i++) {
    data += 'a'
  }
  //return t.set('card', 'shared', 'effort_hours', hoursField.value)
  return t.set('card', 'shared', 'testing_data', data)
  .then(function(){
      t.closePopup();
    }, function(){
      console.log('rejected')
      alert('rejected')
    }
  )
})

document.getElementById('clear').addEventListener('click', function(){
  
  return t.remove('card', 'shared', 'testing_data')
  .then(function(){
    t.closePopup();
  })

})


document.getElementById('show').addEventListener('click', function(){
    return t.get('card', 'shared', 'testing_data').then((t) => {console.log(t)})
})