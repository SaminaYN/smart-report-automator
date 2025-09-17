import xlsx from "xlsx";
import stream from "stream";
import csvParser from "csv-parser";

//For cvs
export const parseCvs = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const result = [];
    const readStream = new stream.PassThrough();
    readStream.end(fileBuffer);

    readStream
      .pipe(csvParser())
      .on("data", (data) => result.push(data))
      .on("end", () => resolve(result))
      .on("error", (err) => reject(err));
  });
};

export const parsexlsx = async (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return data;
};
