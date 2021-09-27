const mongoose = require('mongoose');


const connectDatabase =()=>{
    mongoose.connect(process.env.DB_URI ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(con => {
        console.log(`MongoDB Database connection With HOST: ${con.connection.host}`);
    })
}
module.exports = connectDatabase