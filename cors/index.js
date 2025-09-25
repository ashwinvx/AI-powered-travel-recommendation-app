const cors = require('cors');

const corsOptions = {
    origin: ['https://example.com', 'https://google.com'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = cors(corsOptions);