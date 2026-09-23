const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET_ADMIN_KEY = "YOUR_SUPER_SECRET_KEY_HERE";

let bannedPlayers = {
    "4891355965": "Exploiting/Cheating"
};

// Panel Endpoint
app.post('/api/ban', (req, res) => {
    const { adminKey, userId, reason } = req.body;
    if (adminKey !== SECRET_ADMIN_KEY) {
        return res.status(403).json({ success: false, message: "Unauthorized Admin Key!" });
    }
    bannedPlayers[userId] = reason || "No reason specified";
    return res.json({ success: true, message: `Successfully banned ${userId}` });
});

// Roblox Game Server Endpoint
app.get('/api/check-ban/:userId', (req, res) => {
    const userId = req.params.userId;
    if (bannedPlayers[userId]) {
        return res.json({ banned: true, reason: bannedPlayers[userId] });
    }
    return res.json({ banned: false });
});

// Port connection routing engine setup
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});
