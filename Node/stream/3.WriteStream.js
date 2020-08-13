const fs = require('fs');
const EventEmitter = require('events');
const LinkList = require('./linkList');

class Queue {
  constructor() {
    this.LinkList = new LinkList();
  }
  offer(element) {
    this.LinkList.add(element);
  }
  poll() {
    return this.LinkList.remove(0);
  }
}

class WriteStream extends EventEmitter {
  constructor(path, opts) {
    super();
    this.path = path;
    this.flags = opts.flags || 'w';
    this.autoClose = opts.autoClose || true;
    this.encoding = opts.encoding || 'utf8';
    this.start = opts.start || 0;
    this.mode = opts.mode || 0o666;
    this.highWaterMark = opts.highWaterMark || 16 * 1024;

    // 维护当前存入的数据个数
    this.len = 0;             // 记录调用ws.write记录要写入的个数累加给len属性
    this.writing = false;     // 当前写入的数据的时候，是否正在写入
    this.needDrain = false;   // 是否需要触发drain事件
    this.offset = this.start; // 写入的偏移量
    this.cache = new Queue(); // 缓存链表，缓存多次的写入操作（除了第一次）
    this.open();
  }
  open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) return this.emit('error', err);
      this.fd = fd;
      this.emit('open', fd);
    })
  }
  write(chunk, encoding = 'utf8', cb = () => { }) {
    // chunk的格式有可能是string也有可能是buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    let flag = this.len < this.highWaterMark;
    this.needDrain = !flag;
    if (this.writing) {
      // 正在写入
      this.cache.offer({
        chunk,
        encoding,
        cb
      })
    } else {
      this.writing = true;
      // 没有正在写入
      this._write(chunk, encoding, () => {
        cb();
        this.clearBuffer(); //内容写入完毕，清空缓存区内容
      });
    }
    return flag;
  }
  _write(chunk, encoding, cb) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, encoding, cb));
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
      if (err) return this.emit('error', err);
      this.len -= written;
      this.offset += written;
      cb();
    })
  }
  clearBuffer() {
    let data = this.cache.poll();
    if (data) {
      // 情况缓存
      let { chunk, encoding, cb } = data;
      this._write(chunk, encoding, () => {
        cb();
        this.clearBuffer();
      })
    } else {
      this.writing = false; // 目前数据已经写完。
      if (this.needDrain) {
        this.needDrain = false;
        this.emit('drain')
      }
    }
  }
}

module.exports = WriteStream;