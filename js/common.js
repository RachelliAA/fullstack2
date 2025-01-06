document.addEventListener("DOMContentLoaded", () => {
    // Add header
    const header = document.createElement("header");
    header.innerHTML = `
      <div id-"common" class="header-container">
        <a href="../pages/menu.html">
          <img src="../img/logo.png" alt="Logo" class="logo">
        </a>
      </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);
  
    // Add footer
    const footer = document.createElement("footer");
    footer.innerHTML = `
      <div class="footer-container">
        <p>&copy; ${new Date().getFullYear()} Rachelli and Riki. All rights reserved.</p>
      </div>
    `;
    document.body.appendChild(footer);
  });
  