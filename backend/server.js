require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { startAgenda } = require("./services/agenda");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  // Start Agenda after DB connected
  await startAgenda();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
