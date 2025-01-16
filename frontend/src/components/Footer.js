import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© 2025 DocStamp. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#f1f1f1",
    marginTop: "2rem",
  },
};

export default Footer;
