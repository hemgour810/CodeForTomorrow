const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URL || "mongodb://127.0.0.1:27017/codeFotTomorrow";

    console.log("Try to connect", mongoURI);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" There is some error with connection:", error.message);
    process.exit(1);
  }
};

module.exports = ConnectDB;
