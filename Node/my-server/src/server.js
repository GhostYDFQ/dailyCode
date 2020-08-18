const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const { createReadStream, createWriteStream, readFileSync } = require('fs');

const ejs = require('ejs');
const mime = require('mime');
const chalk = require('chalk');
const zlib = require('zlib');
const template = readFileSync(path.resolve(__dirname, 'index.html'),'utf8');

class Server {
	constructor(config){
		this.port = config.port;
		this.directory = config.directory;
		this.host = config.host;
		this.template = template;
		this.cache = {};
	}
	async handleRequest(req, res) {
		// 通过路径找文件
		let { pathname } = url.parse(req.url);
		// 找真实文件
		pathname = decodeURIComponent(pathname); // 解码传来的是将汉字转成buffer的字符串
		if(pathname === '/favicon.ico') {
			return res.end('');
		}
		let filePath = path.join(this.directory,pathname);
		try {
			const statObj = await fs.stat(filePath);
			if(statObj.isFile()){
				// 文件
				this.sendFile(req,res,filePath,statObj)
			}else{
				// 文件夹
				this.showList(req,res,filePath,statObj,pathname)
			}
		}catch (e) {
			this.sendError(req,res,e);
		}
	}
	gizp(req,res,filePath,statObj){
		const reqHeaders = req.headers;
		if(reqHeaders['accept-encoding'] && reqHeaders['accept-encoding'].includes('gzip')){
			res.setHeader("content-encoding",'gzip');
			return zlib.createGzip();
		}else{
			return false;
		}
	}
	sendFile(req,res,filePath,statObj){
		const gizp = this.gizp(req,res,filePath,statObj);
		res.setHeader('Content-Type',mime.getType(filePath)+';charset=utf-8');
		console.log(gizp);
		if(gizp){
			createReadStream(filePath).pipe(gizp).pipe(res);
		}else{
			res.setHeader('Content-Type',mime.getType(filePath)+';charset=utf-8');
			createReadStream(filePath).pipe(res);
		}
	}
	async showList(req,res,filePath,statObj,pathname) {
		if(!this.cache[filePath]){
			const files = await fs.readdir(filePath);
			this.cache[filePath] = files;
		}
		try {
			let parseObj = this.cache[filePath].map(item=>({
				dirs: item,
				href: path.join(pathname, item)
			}));
			
			let templateStr = await ejs.render(this.template,{dirs:parseObj},{async: true});
			res.setHeader('Content-Type','text/html;charset=utf-8');
			res.end(templateStr);
		}catch (e) {
			this.sendError(req,res,e)
		}
	}
	sendError(req,res,e) {
		res.end(e.toString());
	}
	start() {
		const server = http.createServer(this.handleRequest.bind(this));
		
		server.listen(this.port,this.host,()=>{
			console.log(chalk.yellow(`start serveing ${this.directory}\r\n`));
			console.log(chalk.green(`     http://${this.host}:${this.port}`))
		})
	}
}
module.exports = Server;
