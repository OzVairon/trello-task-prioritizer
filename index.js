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
app.get('/effort_hours', (req, res) => {
  	res.render('pages/effort_hours')
	})
	
	app.get('/section', (req, res) => {
  	res.render('pages/section')
  })

app.get('/settings', (req, res) => {
  	res.render('pages/modal')
  })

app.get('/auth', (req, res) => {
    res.send(req.body)
  })
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

