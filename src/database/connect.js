const mongoose = require("mongoose");
module.exports = async (client) => {
  const mongopath = client.Config.Tokens.Mongo;
  
  try {
    await mongoose.connect(mongopath, {
      dbName: "prod",
    });
    console.log(`[MongoDB] Connected`);
  } catch (e) {
    console.log("[MongoDB] Connection Error");
  }
};