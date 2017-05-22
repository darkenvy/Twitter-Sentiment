require('dotenv').config();
let Datastore = require('nedb');
let emojiRegex = require('emoji-regex');
let db = new Datastore({filename: __dirname + '/sentiments.db.json'});
const EMOJIS = { // sentment, strength (0=normal str. 1=strong)
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
  "😍": [1   , 0  ], "😛": [0.8  ,0  ], "😳": [-0.8, 0  ], "😣": [1    , 0 ], 
  "😢": [1   , 0  ], "😓": [-0.2 , 0 ], "😩": [-0.4, 0  ], "😤": [-0.8 , 0 ], 
  "😖": [-0.8, 0  ], "😵": [-0.2 , 0 ], "😲": [-0.2, 0  ], "😮": [0    , 0 ], 
  "😬": [0   , 0  ], "😏": [0.3  , 0 ], "😑": [0   , 0  ]
};
const EMOJI_LIST= (()=>{
  let allEmojis = [];
  for (let each in EMOJIS) allEmojis.push(each);
  return allEmojis;
})();

console.log('Loading & Cleaning Database');
db.loadDatabase( ()=>{
  let Twitter = require('node-tweet-stream'), 
    t = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      token: process.env.ACCESS_TOKEN,
      token_secret: process.env.ACCESS_TOKEN_SECRET
    })
  t.language('en');
  t.track('a');
  t.on('error', err => console.log('Oh no'));

  t.on('tweet', tweet => {
    let hasEmoji = emojiRegex().test(tweet.text);
    if (!hasEmoji) return;
    let sentimentTotal = 0;
    let sentimentsUsed = 0;
    let sentiment   = 0;
    let tweetWords  = tweet.text.match(/(\w+)/g);
    let tweetEmojis = tweet.text.match(emojiRegex());
    let emojisUsed  = [];
    tweetEmojis.forEach((char, idx) => {
      if (EMOJI_LIST.indexOf(char) !== -1) {
        if (emojisUsed.indexOf(char) === -1) {
          emojisUsed.push(char);
          sentimentsUsed++;
          sentimentTotal += EMOJIS[char][0] * (1 + EMOJIS[char][1]);
        }
      }
    });
    if (sentimentTotal !== 0) sentiment = sentimentTotal / sentimentsUsed;
    console.log(sentiment);
  });

});


