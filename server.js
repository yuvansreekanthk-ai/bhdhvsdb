const express = require('express');
const cors = require('cors');
const app = express();

// Standard middleware to parse incoming web data
app.use(cors());
app.use(express.json());

// Set your backend server port
const PORT = process.env.PORT || 3000;

// IMPORTANT: Change this password token to whatever you want.
// This prevents random internet users from hacking your control panel actions.
const SECRET_ADMIN_KEY = "YOUR_SUPER_SECRET_KEY_HERE";

// Live server memory storage configuration (holds active bans during runtime)
let bannedPlayers = {
    // Format example -> "RobloxUserID": "Reason"
    "4891355965": "Exploiting/Cheating"
};

// -------------------------------------------------------------
// ENDPOINT 1: Receives ban updates from your HTML Admin Panel
// -------------------------------------------------------------
app.post('/api/ban', (req, res) => {
    const { adminKey, userId, reason } = req.body;
    
    // Authorization Check
    if (adminKey !== SECRET_ADMIN_KEY) {
        console.warn(`[WARNING] Unauthorised access attempt blocked.`);
        return res.status(403).json({ success: false, message: "Unauthorized Admin Key!" });
    }

    if (!userId) {
        return res.status(400).json({ success: false, message: "Missing UserID parameter." });
    }

    // Save the restriction into memory structure
    bannedPlayers[userId] = reason || "No reason specified";
    console.log(`[BAN EXECUTED] User ID ${userId} has been restricted for: ${reason}`);
    
    return res.json({ success: true, message: `Successfully registered ban parameters for UserID ${userId}` });
});

// -------------------------------------------------------------
// ENDPOINT 2: Audits incoming joins from Roblox Game Servers
// -------------------------------------------------------------
app.get('/api/check-ban/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Check if the UserID exists inside the restriction collection
    if (bannedPlayers[userId]) {
        console.log(`[AUDIT HIT] Blocked banned user ${userId} from entering the game server.`);
        return res.json({ banned: true, reason: bannedPlayers[userId] });
    }
    
    // Profile clear: allow authorization mapping pass
    return res.json({ banned: false });
});

// Start listening for inbound game network traffic hooks
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  Rivals-Style Admin Gateway Engine Online         `);
    console.log(`  Running live network listening channel on port ${PORT} `);
    console.log(`==================================================`);
});
