let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('import.txt')
});
let lexiconOut = {};

lineReader.on('line', function (line) {
  // console.log('Line from file:', line);
  //　0.125 0.375
  if (line[0] === '#') return;
  let regex = /^.\s\d+\s(\d+\.?\d*)\s(\d+\.?\d*)\s(\w+)/g;
  let matches = regex.exec(line);
  if (matches && matches.length >= 3) {
    let pos  =   parseInt(matches[1]),
        neg  = 0-parseInt(matches[2]),
        word =            matches[3];
    let score = pos + neg;
    let strength = Math.abs(pos - neg)/2;
    // if (strength === 0 && score === 0 && pos === 0 && neg === 0) return;
    // console.log(strength, score, word);
  }
});

lineReader.on('close', () => {
  console.log('done');
})