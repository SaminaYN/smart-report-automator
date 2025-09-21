import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadData,
  cleanedData,
  syncData,
  downloadCsvData,
  // downloadXlsxData,
} from "../controllers/data.controllers.js";

const dataRouter = Router();

dataRouter.post("/upload-data", upload.single("file"), uploadData);
dataRouter.post("/processed-data", cleanedData);
dataRouter.post("/sync-data", syncData);
dataRouter.get("/download", downloadCsvData);
// dataRouter.get("/download-xlsx", downloadXlsxData);

export default dataRouter;
