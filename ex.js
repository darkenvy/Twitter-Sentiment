let Datastore = require('nedb');
let bodyParser = require('body-parser');
let async = require('async');
let express = require('express');
let app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.post('/', (req, res) => {
  // req.body.payload
  let db = new Datastore({filename: __dirname + '/sentiments.db.json'});
  db.loadDatabase( ()=>{
    let words = req.body.payload.replace(/[^a-z0-9\s]/gi, '').split(' ');
    let sentiment = 0.0;
    let strength = 0.0;
    let total = 0;
    console.log('WORD LIST', words);
    async.concat(words, function(word, cb) {
      if (word.length <= 1) {cb(); return}
      db.findOne({word: word.toLowerCase()}, (err, result) => {
        if (!result) {cb(); return}
        console.log('Tried to find ', word);
        let pos = result.pos;
        let neg = 0-result.neg;
        let calculated = (pos + neg) / result.count;
        let strCalculated = findHighest(pos, neg) / result.count;
        sentiment += calculated;
        strength += strCalculated;
        // console.log('strength: ', strength, findHighest, findHighest/result.count);
        total++;
        cb();
      });
    }, complete => {
      console.log('hit complete');
      console.log('SENTIMENT: ', sentiment)
      let rSentiment = sentiment / total || 0;
      let rStrength = strength   / total || 0;
      let rWeightedSentiment = (rStrength*2) * rSentiment;
      res.send({
        sentiment: rSentiment,
        strength:  rStrength,
        weightedSentiment: rWeightedSentiment < 1 ? rWeightedSentiment : 1
      });
    })


    // db.find({word: 'trump'}, (err, result) => {
    //   res.send(result)
    // });
  });
});

console.log('listening on port 3000');
app.listen(3000);



// ---- Helper Funcs ---- //

function findHighest(one, two) {
  return Math.abs(one) >= Math.abs(two) ? one :  two;
}