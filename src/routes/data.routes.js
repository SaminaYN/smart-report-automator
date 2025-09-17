import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadData,
  cleanedData,
  syncData,
  downloadData,
} from "../controllers/data.controllers.js";

const dataRouter = Router();

dataRouter.post("/upload-data", upload.single("file"), uploadData);
dataRouter.post("/cleaned-data", cleanedData);
dataRouter.post("/sync-data", syncData);
dataRouter.get("/download-cleaned-data", downloadData);

export default dataRouter;
