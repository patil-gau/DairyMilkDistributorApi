const rateLimit = require("express-rate-limit");

const {API_RATE_LIMIT,API_RATE_LIMIT_TIME_FRAME} = process.env;

//limit the number of requests to 5 in a period of 1 minute
//max of only 5 requests can be made in 1 minute
const limiter = rateLimit({
  max : API_RATE_LIMIT,  
  windowMs :API_RATE_LIMIT_TIME_FRAME ,
  message: "To many requests reached. Please try after some time"
});

module.exports = limiter;

