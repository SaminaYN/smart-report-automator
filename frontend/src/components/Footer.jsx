import React from "react";

const Footer = () => {
  return (
    <section className="shadow mt-4 h-8">
      <footer className="text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} SRA. All rights reserved.
      </footer>
    </section>
  );
};

export default Footer;
