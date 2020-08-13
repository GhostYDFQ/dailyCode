const fs = require('fs');
const path = require('path');
const WriteStream = require('./3.WriteStream.js');

let ws = /*fs.createWriteStream*/new WriteStream(path.resolve(__dirname, 'target1.txt'), {
  highWaterMark: 3
})


let index = 0;

function myWrite() {
  let flag = true;
  while (flag && index < 10) {
    flag = ws.write(index + '');
    index++;
  }
  // if (index == 10) {
  //   ws.end('!!');
  // }

}

myWrite();

// 每次超出预期并且将内容写入文件并且清空之后会触发再次调起写入事件。
ws.on('drain', () => {
  console.log("drain")
  myWrite()
})
// 关闭文件的时候触发
ws.on('close', () => {
  console.log('close');
})