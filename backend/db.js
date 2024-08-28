const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/inotebook';

const connectToMongo = async ()=> {
    try{
        mongoose.connect(mongoURL);
        console.log('Mongo connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;
