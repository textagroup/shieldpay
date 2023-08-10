import fs from "fs";

import shieldpay from "./shieldpay.js";

import promptSync from "prompt-sync";
var prompt = promptSync();

let config;


if (fs.existsSync('config.json')) {
	//file exists
	fs.readFile('config.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		config = JSON.parse(data);
		var lib = new shieldpay(config);
		let response = lib.addUser();
		console.log(lib.getResponse());
	});
} else {
	let api = prompt('What is your API key? ');
	let key = prompt('Where is your private key? ');
	let cert = prompt('What is your CSR? ');

	let writeConfig = {
		api: api,
		key: key,
		cert: cert,
	}

	fs.writeFile('config.json', JSON.stringify(writeConfig), err => {
		if (err) {
			console.error(err);
		}
		// file written successfully
	});
}

