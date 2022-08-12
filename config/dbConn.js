const mongoose = require('mongoose');

const connectWithDatabase = async()=>{
   await mongoose.connect(
        process.env.MONGO_URL,
        {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }
    ).then((res)=>{
        console.log("[INFO] Database connection established.");  
    }).catch((err)=>{
        console.log(`[ERROR] Error connecting to database ${String(err)}`);
    })
}

module.exports = connectWithDatabase;