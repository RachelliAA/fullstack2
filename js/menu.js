// Toggle the sidebar menu
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
  }
  
  // Logout function
  function logout() {
    alert("You have been logged out!");
    localStorage.removeItem('current user');
    window.location.href = '../index.html';
  }
  

  //<a href="../index.html" onclick="logout()"></a>