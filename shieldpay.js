import crypto from "crypto";
import fs from "fs";
import https from "https";
import fetch from "node-fetch";

import promptSync from "prompt-sync";
var prompt = promptSync();

class shieldpay {

	url;
	requestId;
	timestamp;
	privateKey;
	cert;
	signature;
	apiResponse;

	constructor(data) {
		this.config = data;
	}

	setup(payload, post = 0) {
		this.requestId = this.getRequestId();
		this.timestamp = this.getTimestamp();
		this.getPrivateKey();
		this.getCert();
		this.getTimestamp();
		this.getSignature(payload, post);
	}

	getConfig() {
		return this.config;
	}

	getRequestId() {
		// Must be unique for every request.
		return crypto.randomUUID(); 
	}

	getTimestamp() {
		// Must be less than 5 minutes old.
		return new Date().toISOString();
	}

	getPrivateKey() {
		this.privateKey = fs.readFileSync(this.config.key);
	}

	getCert() {
		this.cert = fs.readFileSync(this.config.cert);
	}

	getSignature(payload, post) {
		let signatureString = this.url + this.config.api + this.requestId + this.timestamp;
		if (post == 1) {
			signatureString += payload;
		}
		this.signature = crypto
                    .sign("RSA-SHA256", Buffer.from(signatureString), this.privateKey)
                    .toString("base64");
	}

	async createResponse(payload, post = 0) {
		const postResponse = await fetch(this.url, {
			method: 'POST',
			agent: new https.Agent({
				cert: this.cert,
				key: this.privateKey,
			}),
			headers: {
				Authorization: this.config.api,
				Timestamp: this.timestamp,
				RequestID: this.requestId,
				DigitalSignature: this.signature
			},
			body: payload
		});
		const getResponse = await fetch(this.url, {
			method: 'GET',
			agent: new https.Agent({
				cert: this.cert,
				key: this.privateKey,
			}),
			headers: {
				Authorization: this.config.api,
				Timestamp: this.timestamp,
				RequestID: this.requestId,
				DigitalSignature: this.signature
			},
		});
		if (post == 1) {
			this.apiResponse = await postResponse.json();
		} else {
			this.apiResponse = await getResponse.json();
		}
		return this.apiResponse;
	}

	async getResponse() {
		try {
			return await this.apiResponse;
		}
		catch (error) {
			console.log("error: " + error);
		}
	}

	async addUser() {
		this.url = "https://api.sandbox.partner.shieldpay.com/v1/users";

		let email_address = prompt("What is the users email address? ");
		let first_name = prompt("What is the users first name? ");
		let last_name = prompt("What is the users last name? ");
		let dial_code = prompt("What is the users dial code? ");
		let phone_number = prompt("What is the users phone number? ")
		let date_of_birth = prompt("What is the users date_of_birth? ")

		const payload = JSON.stringify({
			email_address: email_address,
			first_name: first_name,
			last_name: last_name,
			dial_code: dial_code,
			phone_number: phone_number,
			date_of_birth: date_of_birth,
		});
		this.setup(payload, 1);
		console.log(await this.createResponse(payload, 1));
	}

	async addProject() {
		this.url = "https://api.sandbox.partner.shieldpay.com/v1/projects";

		let name = prompt("What is the projects name? ");
		let amount = prompt("What is the projects total value? ");
		let currency_id = prompt("What is the projects currency id? ");
		let start_date = prompt("What is the projects start date? ");
		let end_date = prompt("What is the projects end date? ");
		let longstop_date = prompt("What is the projects longstop date? ");
		let project_type_id = prompt("What is the projects type id? ")
		let email_address = prompt("What is the project owners email address? ");
		let no_of_approvers = prompt("How many approvers do you need (2 or 3)? ")

		const payload = JSON.stringify({
			name: name,
			amount: amount,
			currency_id: currency_id,
			start_date: start_date,
			end_date: end_date,
			longstop_date: longstop_date,
			project_type_id: project_type_id,
			email_address: email_address,
			no_of_approvers: no_of_approvers,
		});
		this.setup(payload, 1);
		console.log(await this.createResponse(payload, 1));
	}

	async getProjects() {
		this.url = "https://api.sandbox.partner.shieldpay.com/v1/projects";

		let current_page = prompt("Do you have a pagination page you want to view? ", 1);
		let page_size = prompt("How many records do you want to retrieve (default is 10)? ", 10);

		const payload = JSON.stringify({
			current_page,
			page_size,
		});
		this.setup(payload, 0);
		console.log(await this.createResponse(payload, 0));
	}
}

export { shieldpay as default };
