#! /usr/bin/env node
const program = require('commander');
const json = require('../package');
const Server = require('../src/server');

program.name('my-server')
	.usage('[argv]')
	.version(json.version);
const config = {
	port: {
		options: '-p --port <val>',
		description: 'set tour server port'
	},
	directory: {
		options: '-d --directory <val>',
		description: 'set your start directpry'
	},
	host: {
		options: '-h --host <val>',
		description: 'set your hostname'
	}
};
Object.values(config).forEach(val => {
	if(val.options) {
		program.option(val.options,val.description)
	}
});

// 默认参数
const defaultValue = {
	port: 3000,
	directory: process.cwd(),
	host: 'localhost'
};
Object.keys(config).map(item=>{
	return program.parse(process.argv)[item] || defaultValue[item]
});


const { port, directory, host } = program.parse(process.argv);
const resultValue = {
	port: port || defaultValue.port,
	directory: directory || defaultValue.directory,
	host: host || defaultValue.host
};

let server = new Server(resultValue);
server.start();
