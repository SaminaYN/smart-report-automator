export const helperFuntion = async () => {
  const file = req.file;
  const ext = file.originalname.split(".").pop().toLowerCase();
  let rawData = [];

  if (ext === "csv") {
    rawData = await parseCvs(file.buffer);
  } else if (ext === "xlsx") {
    rawData = await parsexlsx(file.buffer);
  } else {
    return res.status(400).json({ error: "Only CVS or XLSX allowed" });
  }

  
};
