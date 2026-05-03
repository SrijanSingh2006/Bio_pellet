const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://sachdevak806:Otvw0iWcOdjrMuA@cluster0.yyjxa7i.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas!');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  } finally {
    await client.close();
  }
}

run();
