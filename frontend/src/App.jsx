import { Routes, Route } from "react-router-dom";
import UploadData from "./components/UploadData";
import ProcessedData from "./components/ProcessedData";
import Navbar from "./components/Navbar";
import History from "./components/History";
import Footer from "./components/Footer";
const App = () => {
  return (
    <div className="px-5 py-5 sm:px-7 md:px-9 sm:py-7 md;py-9 w-[100vw] h-[100vh]">
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadData />}>
          Upload
        </Route>
        <Route path="/proccessed-data" element={<ProcessedData />}>
          Upload
        </Route>
        <Route path="/history" element={<History />}>
          History
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
