const
	assert = require('assert'),
	path = require('path'),
	util = require('util'),
	fs = require('epic.util').fs


class Config {

	constructor (root) {
		this.root = root;
	}

	env (key) {
		if (process.env[key] !== undefined) return process.env[key];
		if (process.env[`npm_config_${key}`] !== undefined) return process.env[`npm_config_${key}`];
		if (process.env[`npm_package_config_${key}`] !== undefined) return process.env[`npm_package_config_${key}`];
		if (process.env[`npm_package_${key}`] !== undefined) return process.env[`npm_package_${key}`];
		return undefined;
	}

	package (key) {
		let result;
		try {
			result = require(path.resolve(this.root, './package.json'));
		} catch (e) {
			console.error(`epic.config: package.json file not found ${path.resolve(this.root, './package.json')}`);
			return undefined
		}

		if (result[`config.${key}`] !== undefined) return result[`config.${key}`];
		if (result[key] !== undefined) return result[key];
		if (result[`config.${key}`] !== undefined) return result[`config.${key}`];
		
		return undefined
	}
}


class Loader {

	static load (...args) {
		let result = fs.load(...args);
		if (result.length === 0)
			console.error('epic.config: conf file was not found in these path \r\n%j', args);
		return result;
	}

	static middleware (dir) {
		let result = new Config(dir), NODE_ENV = result.env('NODE_ENV') === 'development' ? 'dev' : 'prod';
		let files = [];
		['./', './conf/', '../', '../conf/'].forEach(prefix => {
			['base.conf.js', 'conf.js', `${NODE_ENV}.conf.js`].forEach(file => files.push(path.resolve(dir, prefix + file)));
		});
		return Object.assign(result, ...Loader.load(...files));
	}

}


module.exports = Loader.middleware;