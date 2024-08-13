import { Router } from "express";
import authController from "../controller/auth.controller";
import { loginValidator, signupValidator, validate } from "../utils/validators.util";
import { isAuth } from "../middleware/auth.middleware";
const router = Router();

router.post("/auth/login",authController.login);
router.post("/auth/register",authController.register);
router.get("/getAllUsers",isAuth(),authController.getAllUsers);
router.post("/updateUser/:userId",isAuth(["admin","user"]),authController.updateUser);
router.post("/deleteUser/:userId",isAuth(["admin"]),authController.deleteUser);
router.get("/profile/me",authController.getProfile);
router.post("/changePassword",isAuth(["admin","user"]),authController.changePassword);
router.get("/getUserInfo/:userId",isAuth(["admin"]),authController.getUserInfo);
export default router;