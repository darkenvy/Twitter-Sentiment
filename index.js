require('dotenv').config();
let emojiRegex = require('emoji-regex');
const EMOJIS = {
  "😄": 1,    "😃": 1,    "😀": 1,    "😊": 0.75, "☺" : 0.5,  "😉": 0.5,  "😍": 1,
  "😚": 1,    "😗": 0.8,  "😙": 0.5,  "😜": 0.8,  "😝": 0.8,  "😛": 0.8,  "😳": -0.8, 
  "😁": 0,    "😔": 1,    "😌": 0.4,  "😒": -0.3, "😞": 0.6,  "😣": 1,    "😢": 1,
  "😭": 1,    "😪": -0.5, "😥": -0.5, "😰": -0.9, "😅": 0,    "😓": -0.2, "😩": -0.4, 
  "😫": -0.8, "😨": -1,   "😱": -1,   "😠": -0.8, "😡": -1,   "😤": -0.8, "😖": -0.8, 
  "😆": 0.7,  "😋": 0.6,  "😷": -0.1, "😎": 0.3,  "😴": 0,    "😵": -0.2, "😲": -0.2, 
  "😟": -0.2, "😦": -0.1, "😧": -0.1, "😈": 0.5,  "👿": -0.5, "😮": 0,    "😬": 0, 
  "😐": 0,    "😕": -0.3, "😯": 0,    "😶": 0,    "😇": 0.7,  "😏": 0.3,  "😑": 0,
  "😘": 1,    "😂": 1
};


// let Twitter = require('node-tweet-stream'), 
//   t = new Twitter({
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     token: process.env.ACCESS_TOKEN,
//     token_secret: process.env.ACCESS_TOKEN_SECRET
//   })
// t.language('en');
// t.track('a');
// t.on('error', err => console.log('Oh no'));

// t.on('tweet', tweet => {
//   let hasEmoji = emojiRegex().test(tweet.text);
//   // console.log('hasEmoji ------------', hasEmoji);
//   if (hasEmoji) console.log(tweet.text);
// })

let txt = `Take some time and watch ancient African history. 👊🏿🌍🍿 https://t.co/aa574iTrCC`
let tweetEmojis = txt.match(emojiRegex());
console.log(tweetEmojis.length);


// console.log(emojiRegex().test(`tweet received RT @_atypicalsgirls: A Man Gets Killed By A Hitman In Front Of His Wife And What Happens Next Is Brutal''`));