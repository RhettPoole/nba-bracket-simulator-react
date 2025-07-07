import React from "react";

function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1rem 0",
      color: "#888",
      fontSize: "0.95rem",
      marginTop: "2rem"
    }}>
      &copy; {new Date().getFullYear()} NBA Bracket Sim - Rhett Poole
    </footer>
  );
}

export default Footer;
