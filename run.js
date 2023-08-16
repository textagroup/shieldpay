import fs from "fs";

import shieldpay from "./shieldpay.js";

import promptSync from "prompt-sync";
var prompt = promptSync();

let config;

const methods = [
	'addUser',
	'addProject',
	'getProject',
	'testSignatureGeneration',
	'testSignatureGenerationFromAuthString',
];

if (fs.existsSync('config.json')) {
	//file exists
	fs.readFile('config.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log("The folloing methods can be run!");
		for (let i = 0; i < methods.length; i++) {
			console.log(i + 1 + ': ' + methods[i]);
		}
		let choice = prompt("Please select a method? ");
		config = JSON.parse(data);
		var lib = new shieldpay(config);
		switch (choice) {
			case '1':
				lib.addUser();
				break;
			case '2':
				lib.addProject();
				break;
			case '3':
				lib.getProjects();
				break;
			case '4':
				lib.testSignatureGeneration();
				break;
			case '5':
				lib.testSignatureGenerationFromAuthString();
				break;
			default:
				console.log('Invalid selection');
				return;
		}
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

