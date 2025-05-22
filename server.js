const app = require("./src/app"); // Import app
// Import env variables
require("dotenv").config();
// Import database connection
require("./src/database/db_connect");
// Create HTTP server
const http = require("http").createServer(app);

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
