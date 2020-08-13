const fs = require('fs');
const path = require('path');

/*
- 基于events
- 如果文件不存在会创建
- 默认每次清空后在写入
*/
let ws = fs.createWriteStream(path.resolve(__dirname, 'target.txt'), {
  flags: 'w',             // 默认w
  encoding: 'utf-8',      // 默认urf-8
  mode: 0o666,            // 权限
  autoClose: true,        // 关闭后是否自动关闭
  emitClose: true,        // 是否发射关闭事件
  start: 0,               // 开始位置  
  highWaterMark: 3        // 默认16*1024，不会影响内容的写入，只是预期占用的内存大小，调用ws.write的时候返回一个布尔值flag,代表当前是否符合设置的预期,符合true不符合就false
});

// 写入的内容必须是string或者buffer
let flag = ws.write('hello')
ws.write('world')
ws.write('!!!');

/*
drain触发的条件是
- 1.必须达到预期或者超过预期的highWaterMark
- 2.内存中的内容在写入完毕全部清空后触发。
*/
ws.on('drain', () => {
  console.log("drain")
})
// ws.open();
// ws.close();
