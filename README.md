# Node Shieldpay script

## Basic node script to work with the Shieldpay API

It contains a scripts run.js which will ask for your API key and locations
of your private key and certificate the first time it is run.

It will store this in a config.json file and the next time it is run it will use the 
details to attempt an API request.

The bulk of the API code is stored in shieldpay.js and is used by run.js as a library.

You will need to provide Shieldpay with the certificate and private key and the IP address
you will be connecting from will need to be added to a whitelist by Shieldpay.

For more details visit the documentation from [Shieldpay](https://developer.partner.shieldpay.com/#section/Getting-Started)

This is very much a work in progress and is only for testing with the sandbox API.
