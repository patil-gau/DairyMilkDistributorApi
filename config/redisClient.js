const redis = require('redis');

const { REDIS_HOST } = process.env;
const REDIS_PORT = process.env.REDIS_PORT || 6379

//create a redis client
const client = redis.createClient({REDIS_HOST,REDIS_PORT});

//add event listener for listening errors
client.on('error',(err)=>{
        console.log(`[ERROR] Error connecting to redis ${err}`);
});

client.on('ready',()=>{
        console.log(`[INFO] Connected to Redis`);
})

module.exports = client;
