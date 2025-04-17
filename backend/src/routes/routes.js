import express from "express";
import contactController from "../controllers/contact/controller.js";
import userController from "../controllers/user/controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/reset-password", userController.resetPassword);

router.use(authMiddleware);

router.post("/contacts", contactController.create);
router.get("/contacts", contactController.findAll);
router.get("/contacts/export", contactController.exportToCSV);
router.get("/contacts/:id", contactController.findOne);
router.put("/contacts/:id", contactController.update);
router.delete("/contacts/:id", contactController.delete);


export default router;
