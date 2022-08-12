require('dotenv').config();
const connectToDb = require('./config/dbConn.js');
const app = require('./index.js');

const PORT = process.env.PORT || 8000;

//make database connection
connectToDb();


//start the server
app.listen(PORT,()=>{
    console.log(`[INFO] Listening at PORT ${PORT}`);
});



