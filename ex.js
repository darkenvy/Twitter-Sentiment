let Datastore = require('nedb');
let bodyParser = require('body-parser');
let async = require('async');
let Lemmer = require('lemmer');
let express = require('express');
let pos = require('pos');
let tagger = new pos.Tagger();
let app = express();

let amplifiers = ['RB', 'RBR', 'RBS', 'JJ', 'JJR', 'JJS'];

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/test', (req, res) => {
  let words = new pos.Lexer().lex(req.body.text);
  let taggedWords = tagger.tag(words);
  for (i in taggedWords) {
    let taggedWord = taggedWords[i];
    let word = taggedWord[0];
    let tag = taggedWord[1];
    
  }
  res.send('done')
});

app.post('/', (req, res) => {
  // req.body.payload
  let db = new Datastore({filename: __dirname + '/sentiments.db.json'});
  db.loadDatabase( ()=>{
    let words = req.body.payload.replace(/[^a-z0-9\s]/gi, '').split(' ');
    let sentiment = 0.0;
    let total = 0;
    let outputList = [];
    console.log('WORD LIST', words);
    async.concat(words, function(word, cb) {
      if (word.length <= 1) {cb(); return}
      Lemmer.lemmatize(word.toLowerCase(), (err, lemmed) => {
        db.findOne({word: lemmed[0].toLowerCase()}, (err, result) => {
          if (!result) {cb(); return}
          console.log('Tried to find ', word);
          let pos = result.pos;
          let neg = 0-result.neg;
          let calculated = (pos + neg) / result.count;
          sentiment += calculated;
          total++;
          outputList.push({
            word: lemmed[0],
            sentiment: calculated
          });
          cb();
        });
      });
    }, complete => {
      console.log('hit complete');
      console.log('SENTIMENT: ', sentiment)
      let rSentiment = sentiment / total || 0;
      res.send({
        total_sentiment: rSentiment,
        word_list: outputList
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