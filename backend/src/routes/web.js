import express from "express";
import { login } from "../controllers/admin/authcontroller.js";
import {
  index as listPermissions,
  create as createPermission,
  update as updatePermissionCtrl,
  remove as deletePermissionCtrl,
} from "../controllers/admin/permissioncontroller.js";

import {
  index as listRoles,
  create as createRole,
  update as updateRole,
  remove as deleteRole,
} from "../controllers/admin/rolescontroller.js";

const router = express.Router();

/* AUTH */
router.post("/auth/login", login);

/* PERMISSIONS */
router.get("/permissions", listPermissions);
router.post("/permissions", createPermission);
router.put("/permissions/:id", updatePermissionCtrl);
router.delete("/permissions/:id", deletePermissionCtrl);

/* ROLES */
router.get("/roles", listRoles);
router.post("/roles", createRole);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

export default router;
