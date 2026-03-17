const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger_new.json', 'utf8'));
console.log(JSON.stringify(swagger.components.schemas['CalculateCheckoutRequestDto'], null, 2));
console.log(JSON.stringify(swagger.components.schemas['CreatePaymentDto'], null, 2));
