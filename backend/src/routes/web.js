// backend/src/routes/web.js
import express from "express";
import { login } from "../controllers/admin/authcontroller.js";
import {
  index as listPermissions,
  create as createPermission,
  update as updatePermissionCtrl,
  remove as deletePermissionCtrl,
} from "../controllers/admin/permissioncontroller.js";

const router = express.Router();

router.post("/auth/login", login);

router.get("/permissions", listPermissions);
router.post("/permissions", createPermission);
router.put("/permissions/:id", updatePermissionCtrl);     // edit
router.delete("/permissions/:id", deletePermissionCtrl);  // delete (soft)

export default router;
