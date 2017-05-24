let Datastore = require('nedb');
let bodyParser = require('body-parser');
let async = require('async');
let Lemmer = require('lemmer');
let express = require('express');
let pos = require('pos');
let tagger = new pos.Tagger();
let app = express();

// let amplifiers = ['RB', 'RBR', 'RBS', 'JJ', 'JJR', 'JJS'];
let descriptionWords = ['JJ', 'JJR', 'JJS', 'RB', 'RBR', 'RBS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'];
let conceptualWords = ['NN', 'NNP', 'NNPS', 'NNS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'];

app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/test', (req, res) => {
//   let words = new pos.Lexer().lex(req.body.text);
//   let taggedWords = tagger.tag(words);
//   for (i in taggedWords) {
//     let taggedWord = taggedWords[i];
//     let word = taggedWord[0];
//     let tag = taggedWord[1];
//   }
//   res.send('done')
// });

app.post('/', (req, res) => {
  // req.body.payload
  let db = new Datastore({filename: __dirname + '/sentiments.db.json'});
  db.loadDatabase( ()=>{
    let words = req.body.payload.replace(/[^a-z0-9\s]/gi, '').split(' ');
    let sentiment = 0.0;
    let total = 0;
    let outputList = [];

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
            word: word,
            lemmed: lemmed[0],
            sentiment: calculated,
            pos: getPOS(word)
          });
          cb();
        });
      });
    }, complete => {
      console.log('SENTIMENT: ', sentiment)
      // let rSentiment = sentiment / total || 0;
      res.send(advCalculateSentiment(outputList));
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

function getPOS(word) {
  let words = new pos.Lexer().lex(word);
  let taggedWords = tagger.tag(words);
  let taggedWord = taggedWords[0];
  let tag = taggedWord[1];
  return tag;
}

function advCalculateSentiment(wordList) {
  let multiplierTotal = 0;
  let multiplierCount = 0;
  let baseTotal = 0;
  let baseCount = 0;
  wordList.forEach(word => {
    if (descriptionWords.indexOf(word.pos) !== -1) {
      multiplierTotal += word.sentiment;
      multiplierCount++;
    } else if (conceptualWords.indexOf(word.pos) !== -1) {
      baseTotal += word.sentiment;
      baseCount++;
    }
  });

  var calcSent = function() {
    let multiplier = (multiplierTotal / multiplierCount) || 0;
    let base = baseTotal / baseCount;
    let inverseBase = base >= 0 ? 1-base : -1-base
    // return [multiplier, base, inverseBase, multiplierTotal, multiplierCount]
    return multiplier * inverseBase + base;
  }

  return {
    total_sentiment: calcSent(),
    words: wordList
  }

  // console.log(wordList);
  // let finalSentiment = 0.0;
  // let finalTotal = 0;
  // for (let i=0; i<wordList.length-1; i++) {
  //   if (descriptionWords.indexOf(wordList[i].pos) !== -1
  //   && conceptualWords.indexOf(wordList[i+1].pos) !== -1) {
  //     // change to amplify the following word
  //     finalSentiment += wordList[i].sentiment
  //     finalTotal++;
  //     i++; // skip next word if the current word is describing the next
  //   } else {
  //     finalSentiment += wordList[i].sentiment
  //     finalTotal++;
  //   }
  // }
  // return {
  //   total_sentiment: finalSentiment / finalTotal,
  //   words: wordList
  // }
}