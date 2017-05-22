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
const EMOJI_LIST= (()=>{
  let allEmojis = [];
  for (let each in EMOJIS) allEmojis.push(each);
  return allEmojis;
})();


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
  let tweetEmojis = tweet.text.match(emojiRegex());
  tweetEmojis.forEach((char, idx) => {
    if (EMOJI_LIST.indexOf(char) !== -1) {
      console.log(char, EMOJIS[char]);
    }
  }) 
  
})