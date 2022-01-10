const mongoose = require("mongoose");

module.exports = async function (url) {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.45zhp.mongodb.net/Probook?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("Connected to Probook DB");
  } catch (error) {
    console.error("Something went wrong", error);
  }
};
