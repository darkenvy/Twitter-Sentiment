let Datastore = require('nedb');
let express = require('express');
let app = express();

app.get('/', (req, res) => {
  // res.send('success')
  let db = new Datastore({filename: __dirname + '/sentiments.db.json'});
  db.loadDatabase( ()=>{
    db.find({word: 'trump'}, (err, result) => {
      res.send(result)
    });
  });
});

app.listen(3000);