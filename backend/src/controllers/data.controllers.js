import xlsx from "xlsx";
import axios from "axios";
import { parseCvs, parsexlsx } from "../utils/parser.js";
import { SHEET_DB } from "../config/index.js";

export const uploadData = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const ext = file.originalname.split(".").pop().toLowerCase();
    let rawData = [];
    if (ext === "csv") {
      rawData = await parseCvs(file.buffer);
    } else if (ext === "xlsx") {
      rawData = await parsexlsx(file.buffer);
    } else {
      return res.status(400).json({ error: "Only CVS or XLSX allowed" });
    }

    req.session.rawData = rawData;
    console.log(rawData);
    res.json({ data: rawData, message: "Successfully upload file" });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json(error.message);
  }
};

export const cleanedData = async (req, res) => {
  try {
    let rawData = req.session.rawData;

    if (!rawData) {
      return res
        .status(400)
        .json({ error: "No uploaded data found in session" });
    }

    // --- cleaning steps ---
    rawData = rawData.filter((row) =>
      Object.values(row).some(
        (cell) =>
          cell !== null && cell !== undefined && cell.toString().trim() !== ""
      )
    );

    const keys = Object.keys(rawData[0]);
    const nonEmptyKeys = keys.filter((key) =>
      rawData.some(
        (row) =>
          row[key] !== null &&
          row[key] !== undefined &&
          row[key].toString().trim() !== ""
      )
    );

    rawData = rawData.map((row) => {
      const newRow = {};
      for (const key of nonEmptyKeys) {
        newRow[key] = row[key];
      }
      return newRow;
    });

    //trim spaces
    rawData = rawData.map((row) => {
      const newRow = {};
      for (const key in row) {
        newRow[key] = typeof row[key] === "string" ? row[key].trim() : row[key];
      }
      return newRow;
    });
    // Correct data types (basic guessing)
    rawData = rawData.map((row) => {
      const newRow = {};
      for (const key in row) {
        const cell = row[key];
        if (!isNaN(cell) && cell !== "") newRow[key] = Number(cell); // number
        else if (!isNaN(Date.parse(cell))) newRow[key] = new Date(cell); // date
        else if (["yes", "true"].includes(cell?.toString().toLowerCase()))
          newRow[key] = true; // boolean
        else if (["no", "false"].includes(cell?.toString().toLowerCase()))
          newRow[key] = false; // boolean
        else newRow[key] = cell?.toString() || ""; // string fallback
      }
      return newRow;
    });

    // 5️⃣ Remove duplicate rows
    const seen = new Set();
    rawData = rawData.filter((row) => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    req.session.cleanedData = rawData;

    res.json({ data: rawData, message: "Successfully cleaned data" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const syncData = async (req, res) => {
  try {
    const cleanedData = req.session.cleanedData;

    if (!cleanedData || !cleanedData.length) {
      return res
        .status(400)
        .json({ error: "No uploaded data found in session" });
    }

    const sheetdbEndPoint = SHEET_DB;

    // 1️⃣ Extract headers from incoming data
    const newHeaders = Object.keys(cleanedData[0]);

    // 2️⃣ Get existing data from SheetDB to check current headers
    const existingDataRes = await axios.get(sheetdbEndPoint).catch((err) => {
      // Sheet might be empty, ignore errors
      if (!(err.response && err.response.status === 400)) throw err;
      return { data: [] };
    });

    const existingData = existingDataRes?.data || [];
    const existingHeaders = existingData.length
      ? Object.keys(existingData[0])
      : [];

    // 3️⃣ Determine which headers are missing
    const missingHeaders = newHeaders.filter(
      (header) => !existingHeaders.includes(header)
    );

    // 4️⃣ If there are missing headers, add a dummy row to create them
    if (missingHeaders.length) {
      const initRow = {};
      missingHeaders.forEach((header) => (initRow[header] = ""));
      await axios.post(sheetdbEndPoint, { data: [initRow] }).catch((err) => {
        if (!(err.response && err.response.status === 400)) throw err;
      });
    }

    // 5️⃣ Post actual cleaned data
    const response = await axios.post(sheetdbEndPoint, { data: cleanedData });

    res.json({
      message: "Data successfully synced to SheetDB",
      response: response.data,
    });
  } catch (error) {
    console.error("Sync Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to sync data",
      error: error.response?.data || error.message,
    });
  }
};

export const downloadData = async (req, res) => {
  try {
    const cleanedData = req.session.cleanedData;
    if (!cleanedData || !cleanedData.length) {
      return res
        .status(400)
        .json({ error: "No cleaned data found in session" });
    }
    const fileType = req.query.type || "xlsx";
    const ws = xlsx.utils.json_to_sheet(cleanedData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "cleanedData");

    if (fileType === "csv") {
      const csvBuffer = xlsx.utils.sheet_to_csv(ws);
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=cleaned-data.csv"
      );
      res.setHeader("Content-Type", "text/csv", "charset=utf-8");
      res.send(csvBuffer);
    } else {
      const xlsxBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=cleaned-data.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(xlsxBuffer);
    }
  } catch (error) {
    console.log(error);
    res.status(200).json(error.message);
  }
};
