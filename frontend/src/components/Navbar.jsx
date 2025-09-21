import React from "react";
import { Link } from "react-router-dom";
import { easeInOut, motion } from "framer-motion";

const MotionLink = motion(Link);

const Navbar = () => {
  return (
    <nav className="card flex items-center justify-between">
      <MotionLink
        to="/"
        whileHover={{
          scale: 1.1,
          rotate: -5,
          y: -3,
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h1>
          SRA{" "}
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
        </h1>
      </MotionLink>
      <ul className="sm:flex gap-5 text-sm text-secondary">
        <motion.li
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0, ease: easeInOut }}
          className="border-b-2 border-transparent hover:text-white hover:text-[15px] transition-all"
        >
          <Link to="/">Upload CVS</Link>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: easeInOut }}
          className=" hover:text-white hover:text-[15px] transition-all"
        >
          <Link to="/proccessed-data">Proccessed Data</Link>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: easeInOut }}
          className=" hover:text-white hover:text-[15px]  transition-all"
        >
          <Link to="/history">History</Link>
        </motion.li>
      </ul>
    </nav>
  );
};

export default Navbar;
