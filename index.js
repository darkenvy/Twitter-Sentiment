require('dotenv').config();
var Twitter = require('node-tweet-stream'), 
  t = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.ACCESS_TOKEN,
    token_secret: process.env.ACCESS_TOKEN_SECRET
  })
 
t.on('tweet', function (tweet) {
  console.log('tweet received', tweet.text)
})
 
t.on('error', function (err) {
  console.log('Oh no')
})

t.language('en')
t.track('a')
