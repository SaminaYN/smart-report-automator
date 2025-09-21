import { createContext, useEffect, useState } from "react";
export const DataContext = createContext();

const DataContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //upload function
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/data/upload-data`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.data);

      setRawData(data.data);
      await fetchProcessedData();
      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  //fetch processed data
  const fetchProcessedData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/data/processed-data`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //download
  const handleDownload = (type) => {
    if (!data || data.length === 0) return;

    const link = document.createElement("a");
    link.href = `${backendUrl}/api/data/download?type=${type}`;
    link.setAttribute(
      "download",
      type === "csv" ? "cleaned-data.csv" : "cleaned-data.xlsx"
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  //connect to google sheet
  const connectGoogleSheet = async () => {
    try {
      if (!data || data.length === 0) return;

      const res = await fetch(`${backendUrl}/api/data/sync-data`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Google Sheet sync failed");

      const result = await res.json();
      console.log("Google Sheet Sync Result:", result);
      if (result.sheetUrl) {
        window.open(result.sheetUrl, "_blank"); // open sheet in new tab
      }
      return result;
    } catch (error) {
      console.error("Google Sheet Sync Error:", error.message);
    }
  };

  // useEffect(() => {
  //   uploadFile;
  // }, []);
  const value = {
    backendUrl,
    uploadFile,
    rawData,
    data,
    fetchProcessedData,
    loading,
    error,
    handleDownload,
    connectGoogleSheet,
  };

  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  );
};

export default DataContextProvider;
