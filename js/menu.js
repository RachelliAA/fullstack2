// Toggle the sidebar menu
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
  }
  
  // Logout function
  function logout() {
    localStorage.removeItem('current user');
    window.location.href = '../index.html';
  }
  

