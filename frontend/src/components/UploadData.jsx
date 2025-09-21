import { FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import ProccessedData from "./ProcessedData";
import { useContext, useRef, useState } from "react";
import { DataContext } from "../context/DataContext";

const UploadData = () => {
  const { uploadFile, rawData } = useContext(DataContext);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    await uploadFile(file);
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <section>
      <header className="flex flex-col items-center justify-center mt-30 mb-10 gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl"
        >
          Smart Report Automator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-secondary"
        >
          Automatically turn your raw data into clean, ready-to-use reports.
        </motion.p>
      </header>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center my-4 gap-4 shadow p-8 py-10"
      >
        <h6 className="tracking-wide">
          Drag and drop a CSV file or click to sleect a file
        </h6>
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
          className="border p-2"
        />
        {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="button-primary flex gap-2 py-6 mt-3"
          onClick={handleUpload}
        >
          <FiUpload className="w-5 h-5 text-red-100" />
          Upload
        </motion.button>
      </motion.div>
      <div>{rawData && <ProccessedData />}</div>
    </section>
  );
};

export default UploadData;
