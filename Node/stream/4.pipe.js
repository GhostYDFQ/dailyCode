const fs = require('fs');
const path = require('path');

let rs = fs.createReadStream(path.resolve(__dirname, './target.txt'));
let ws = fs.createWriteStream(path.resolve(__dirname, 'copy.txt'));
rs.pipe(ws);
