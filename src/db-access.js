const mongodb = require('mongodb');

const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

let collection = undefined;

async function connect() {
    const client = await mongodb.MongoClient.connect(DBHOST);
    const db = client.db(DBNAME);
    collection = await db.collection('quotation');
    console.log(DBHOST, DBNAME, 'quotation');
    return collection;
}

async function getQuotations() {
    if (!collection) {
        collection = await connect();
        console.log('Connected to database');
    }
    //console.log(collection);
    const result = await collection.findOne();
    console.log(result);
    return result;
}

module.exports = { getQuotations };