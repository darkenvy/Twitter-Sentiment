require('dotenv').config();
let Datastore = require('nedb');
let emojiRegex = require('emoji-regex');
let Twitter = require('node-tweet-stream');
let db = new Datastore({filename: __dirname + '/sentiments.db.json'});
let addToDB = {};
let t = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.ACCESS_TOKEN,
  token_secret: process.env.ACCESS_TOKEN_SECRET
});
// const IGNORE_WORDS = ['http', 'https', ];
const EMOJIS = { // sentment, strength (0=normal str. 1=strong)
  // note: get rid of strength. Unused
  "😄": [1   , 0.7], "😃": [1   , 0.5], "😀": [1   , 0.6], "😊": [0.75, 0.7],
  "😚": [1   , 1  ], "😗": [0.8 , 0.7], "😙": [0.5 , 0.7], "😜": [0.8 , 0.9],
  "😁": [0   , 0.2], "😔": [1   , 0.4], "😌": [0.4 , 0.3], "😒": [-0.3, 0.1],
  "😭": [1   , 1  ], "😪": [-0.5, 0.6], "😥": [-0.5, 0.4], "😰": [-0.9, 0.9],
  "😫": [-0.8, 0.7], "😨": [-1  , 1  ], "😱": [-1  , 1  ], "😠": [-0.8, 1  ],
  "😆": [0.7 , 0.6], "😋": [0.6 , 0.7], "😷": [-0.1, 0.1], "😎": [0.3 , 0  ],
  "😟": [-0.2, 0.3], "😦": [-0.1, 0.6], "😧": [-0.1, 0.9], "😈": [0.5 , 0.6],
  "😐": [0   , 0.2], "😕": [-0.3, 0.2], "😯": [0   , 0.5], "😶": [0   , 0  ],
  "😉": [0.5 , 0.4], "😍": [1   , 1  ], "😛": [0.8 , 0.4], "😳": [-0.8, 0.4],
  "😢": [1   , 0.5], "😓": [-0.2, 0.4], "😩": [-0.4, 0.8], "😤": [-0.8, 1  ],
  "😵": [-0.2, 0.6], "😲": [-0.2, 0.6], "😮": [0   , 1  ], "😬": [0   , 0  ],
  "😑": [0   , 0  ], "😘": [1   , 0.8], "😂": [1   , 1  ], "😉": [0.5  , 0 ], 
  "😍": [1   , 0  ], "😛": [0.8  , 0 ], "😳": [-0.8, 0  ], "😣": [1    , 0 ], 
  "😢": [1   , 0  ], "😓": [-0.2 , 0 ], "😩": [-0.4, 0  ], "😤": [-0.8 , 0 ], 
  "😖": [-0.8, 0  ], "😵": [-0.2 , 0 ], "😲": [-0.2, 0  ], "😮": [0    , 0 ], 
  "😬": [0   , 0  ], "😏": [0.3  , 0 ], "😑": [0   , 0  ], "🎂": [0.7, 0   ], 
  "🎊": [0.7, 0   ], "💘": [0.9, 0   ], "🍰": [0.7, 0   ]
  // "🍇": [0.1, 0   ], "🍈": [0.1, 0   ], "🍉": [0.1, 0   ], "🍊": [0.1, 0   ], 
  // "🍋": [0.1, 0   ], "🔥": [0.8, 0.8 ], "🍻": [0.3, 0.1 ], "💡": [0.8, 0.1 ], 
  // "🍌": [0.1, 0   ], "🍍": [0.1, 0   ], "🍎": [0.1, 0   ], "🍏": [0.1, 0   ], 
  // "🍐": [0.1, 0   ], "🍑": [0.1, 0   ], "🍒": [0.1, 0   ], "🍓": [0.1, 0   ], 
  // "🍅": [0.1, 0   ], "🍆": [0.6, 0.3 ], "🌽": [0.1, 0.2 ], "🍄": [0.6, 0.2 ], 
  // "🌰": [0.1, 0   ], "🍞": [0.1, 0   ], "🍖": [0.2, 0.2 ], "🍗": [0.2, 0.2 ], 
  // "🍔": [0.2, 0.4 ], "🍟": [0.1, 0.4 ], "🍕": [0.2, 0.4 ], "🍳": [0.1, 0   ], 
  // "🍲": [0.1, 0   ], "🍱": [0.1, 0   ], "🍘": [0.1, 0.1 ], "🍙": [0.1, 0   ], 
  // "🍚": [0.1, 0   ], "🍛": [0.1, 0   ], "🍜": [0.1, 0   ], "🍝": [0.1, 0   ], 
  // "🍠": [0.1, 0   ], "🍢": [0.1, 0   ], "🍣": [0.1, 0   ], "🍤": [0.2, 0.1 ], 
  // "🍥": [0.1, 0   ], "🍡": [0.2, 0   ], "🍦": [0.2, 0   ], "🍧": [0.2, 0   ], 
  // "🍨": [0.2, 0   ], "🍩": [0.2, 0.1 ], "🍪": [0.2, 0.1 ], "🎂": [0.7, 0   ], 
  // "🍶": [0.3, 0.1 ], "🍷": [0.3, 0.1 ], "🍸": [0.3, 0.1 ], "🍺": [0.3, 0.1 ], 
  // "🍹": [0.3, 0.1 ]
};
const EMOJI_LIST= (()=>{
  let allEmojis = [];
  for (let each in EMOJIS) allEmojis.push(each);
  return allEmojis;
})();

// analytics vars
let tweetCount = 0;
let wordCount = 0;
let newWordCount = 0;

// ------ Main ------
console.log('Loading & Cleaning Database');
db.loadDatabase( ()=>{
  db.persistence.setAutocompactionInterval(120*1000);
  setInterval(()=>{
    console.log(tweetCount*6 + 't/min', wordCount*6 + 'w/min', newWordCount*6 + 'new/min');
    tweetCount=0;
    wordCount=0;
    newWordCount=0;
  }, 10*1000);
  t.language('en');
  t.track('a');
  t.on('error', err => console.log('Oh no'));
  t.on('tweet', tweet => {
    tweetCount++;
    let hasEmoji = emojiRegex().test(tweet.text);
    if (!hasEmoji) return;
    let tweetWords     = tweet.text
                         .replace(/(?:(?:https?:\/\/.+?\s)|(?:https?:\/\/.+$)|(?:@.+?\s)|(?:@.+$)|(?:RT)|(?:#\w+))/g, '')
                         .match(/(\w+)/g),
        tweetEmojis    = tweet.text.match(emojiRegex()),
        emojisUsed     = [];

    tweetEmojis.forEach((char, idx) => {
      if (EMOJI_LIST.indexOf(char) !== -1 && emojisUsed.indexOf(char) === -1) {
        emojisUsed.push(char);
        tweetWords.forEach((word, idx) => { // Apply sentiment values to each word in tweet.
          if (word.length >= 5) addToDB[word] = [ EMOJIS[char][0], EMOJIS[char][1] ];
        });
      }
    });

    // Run database committing if the list is 100 strong.
    if (Object.keys(addToDB).length >= 100) commitToDB();
  });

});


function commitToDB() {
  // console.log('---- Committing to DB ----');
  let cache = addToDB;
  addToDB   = {};
  for (let word in cache) find(word.toLowerCase(), cache[word]); // jshint ignore:line
}

function find(word, sentiments) {
  wordCount++;
  db.findOne({word: word}, (err, doc) => {
    if (!doc) create(word, sentiments);
    else      update(doc,  sentiments);
  });
}

function create(word, sentiments) {
  let doc   = {};
  doc.word  = word;
  doc.pos   = sentiments[0];
  doc.neg   = sentiments[1];
  doc.count = 1;
  newWordCount++;
  // doc.sentiments = sentiments;
  db.insert(doc, (err, saved) => {if (err) console.log('error', err)});
}

function update(doc, sentiments) {
  doc.pos = doc.pos + sentiments[0];
  doc.neg = doc.neg + sentiments[1];
  doc.count = doc.count + 1 || 1;
  db.update({_id: doc._id}, doc, err => {if (err) console.log(err)});
}

// Set interval to clear out single occurances around the point that the process slows.