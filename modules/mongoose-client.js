import config from '#root/config.js';
import mongoose from 'mongoose';

const {ObjectId} = mongoose.Types;

mongoose.Promise = global.Promise;
const client = mongoose.connection;
client.isConnected = false;

client.connect = async () => {
  if (client.isConnected) {
    console.error('Attempt to reconnect when connection is already open.');
  }
  client.once('open', () => {
    client.on('error', console.error);
    // console.info(`Open ${config.mongoose.uri}`);
  });
  client.on('close', () => {
    console.info(`Close ${config.mongoose.uri}`);
  });
  await mongoose.connect(config.mongoose.uri, config.mongoose.options);
  client.isConnected = true;

  // Interrupt from keyboard (e.g. Ctrl-C).
  process.on('SIGINT', () => {
    mongoose.disconnect();
    console.error('"mongoose.connection.close()" on "SIGINT".');
    process.exit(0);
  });

  // Termination signal (e.g. process.kill(pid))
  process.on('SIGTERM', () => {
    mongoose.disconnect();
    console.error('"mongoose.connection.close()" on "SIGTERM".');
    process.exit(0);
  });
};

client.disconnect = async () => {
  client.isConnected = false;
  await mongoose.disconnect(); // Runs .close() on all connections in parallel.
};

client.dropCollection = async (model) => {
  try {
    await model.collection.drop();
  } catch (err) {
    if (err.message !== 'ns not found') {
      throw err;
    }
  }
};

// Inspired by https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-nodejs/
client.isValidObjectId = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }
  return !!(String(new ObjectId(id)) === id);
};

export default client;
