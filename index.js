const
	assert = require('assert'),
	path = require('path'),
	fs = require('epic.util').fs;


class Config {

	constructor () {
	}

	env (key) {
		return process.env[key] || process.env['npm_config_'+ key] || process.env['npm_package_config_'+ key];
	} 
}


class Loader {

	static load (...args) {
		let result = fs.load(...args);
		assert.notEqual(result.length, 0, 'conf file was not found.');
		return result;
	}

	static middleware (dir) {
		let result = new Config();
		let files = [];
		['./', './conf/', '../', '../conf/'].forEach(prefix => {
			['base.conf.js', 'conf.js', `${result.env('NODE_ENV') === 'development' ? 'dev' : 'prod'}.conf.js`].forEach(file => files.push(path.resolve(dir, prefix + file)));
		});
		return Object.assign(result, ...Loader.load(...files));
	}

}


module.exports = Loader.middleware;