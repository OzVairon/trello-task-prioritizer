const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use( function(req, res, next) {

  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

  return next();

});
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/numeric', (req, res) => {
  	console.log('try to render numeric form')

  	let data = {
  		value: req.query.value,
  		name: req.query.name
  	};

  	res.render('pages/numeric_form', {data: data})
  })
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

