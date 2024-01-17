import express from "express";
import * as auth from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/testing", (req, res) => {
    res.json({ success: true });
});

// User Login

router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/logout", auth.logout);
router.post("/secure", authenticate, (req, res) => {
    const userId = req.body.id;
    const userTokenId = req.user._id.toString();
    console.log("User Id: ", userId, userTokenId);
    if (userId === userTokenId) {
        return res.json({ secure: true, message: "User is Authenticated" });
    } else {
        return res.json({
            secure: false,
            message: "User is not Authenticated",
        });
    }
});

export default router;
