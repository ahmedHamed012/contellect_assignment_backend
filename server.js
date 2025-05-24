const app = require("./src/app"); // Import app
// Import env variables
require("dotenv").config();
// Import database connection
require("./src/database/db_connect");
// Create HTTP server
const http = require("http").createServer(app);
const socketIO = require("socket.io");
const io = socketIO(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let lockedContacts = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user locks a contact
  socket.on("lockContact", (contactId) => {
    lockedContacts[contactId] = socket.id;
    io.emit("contactLocked", { contactId, by: socket.id });
  });

  // user unlocks a contact
  socket.on("unlockContact", (contactId) => {
    if (lockedContacts[contactId] === socket.id) {
      delete lockedContacts[contactId];
      io.emit("contactUnlocked", { contactId });
    }
  });

  // On disconnect, unlock all contacts locked by that user
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const contactId in lockedContacts) {
      if (lockedContacts[contactId] === socket.id) {
        delete lockedContacts[contactId];
        io.emit("contactUnlocked", contactId);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
