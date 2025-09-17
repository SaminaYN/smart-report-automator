import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowTypes = ["csv", "xlsx"];
  const ext = file.originalname
    .slice(file.originalname.lastIndexOf(".") + 1)
    .toLowerCase();

  if (allowTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only csv or xlsx files are allowed"));
  }
};

// const storage = multer.memoryStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.filename);
//   },
// });

export const upload = multer({ storage, fileFilter });
