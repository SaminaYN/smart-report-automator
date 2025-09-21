import React, { useContext, useEffect, useRef, useState } from "react";
import ProccessedTable from "./ProccessedTable";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { FaPlug } from "react-icons/fa"; // Font Awesome
import { FiLink } from "react-icons/fi";
import { DataContext } from "../context/DataContext";

const ProcessedData = () => {
  const processedRef = useRef(null);
  const { data, loading, error, handleDownload, connectGoogleSheet } =
    useContext(DataContext);
  const [formate, setFormate] = useState("CSV");

  const handleDownloadClick = () => {
    handleDownload(formate.toLocaleLowerCase());
  };
  useEffect(() => {
    if (data && processedRef.current) {
      processedRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);
  return (
    <section ref={processedRef} className="mt-20 mb-10">
      <h1 className="text-4xl sm:text-5xl md:text-6xl text-center">
        Processed Data
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0 }}
        className="flex justify-center my-2"
      >
        <span className="w-80 h-[2px] bg-gray-500"></span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="flex justify-center my-2 mb-8"
      >
        <span className="w-100 h-[2px] bg-gray-500"></span>
      </motion.div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {data && <ProccessedTable data={data || []} />}

      <div className="flex gap-4 mt-8 items-center justify-center">
        <div className="flex items-center gap-2 py-2 px-4 border-0 bg-purple-500 rounded-xl hover:scale-105 hover:bg-transparent hover:border transition-all ">
          <button
            onClick={handleDownloadClick}
            className="flex gap-4 items-center"
          >
            <FaDownload className="w-4 h-4 text-green-700" />
            Download
          </button>
          <select
            value={formate}
            onChange={(e) => setFormate(e.target.value)}
            className="outline-none px-2 py-1  "
          >
            <option value="CSV" className="text-black">
              CSV
            </option>
            <option value="Excel" className="text-black">
              Excel
            </option>
          </select>
        </div>
        {/* <button
          onClick={connectGoogleSheet}
          className="flex items-center gap-2 py-2 px-4 border rounded-xl hover:bg-purple-500 group hover:scale-105 hover:border-none transition-all"
        >
          <FiLink className="w-6 h-6 text-purple-500 group-hover:text-purple-50" />
          Connect Google Sheet
        </button> */}
      </div>
    </section>
  );
};

export default ProcessedData;
