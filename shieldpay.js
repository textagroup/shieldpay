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
		const method = (post == 0) ? 'GET' : 'POST';
		const response = await fetch(this.url, {
			method: method,
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
		this.apiResponse = await response.json();
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

	async addUser(config, data) {
		this.url = "https://api.sandbox.partner.shieldpay.com/v1/users";

		let email = prompt("What is the users email address? ");
		let first_name = prompt("What is the users first name? ");
		let last_name = prompt("What is the users last name? ");
		let dial_code = prompt("What is the users dial code? ");
		let phone_number = prompt("What is the users phone number? ")
		let date_of_birth = prompt("What is the users date_of_birth? ")

		const payload = JSON.stringify({
			email_address: email,
			first_name: first_name,
			last_name: last_name,
			dial_code: dial_code,
			phone_number: phone_number,
			date_of_birth: date_of_birth,
		});
		this.setup(payload, 1);
		console.log(await this.createResponse(payload, 1));
	}

}

export { shieldpay as default };
