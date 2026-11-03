 
export default function NavbarAdmin() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>Admin Navbar</h2>
        </div>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Users</a></li>
          <li><a href="#">Settings</a></li>
          <li><a href="#">Logout</a></li>
        </ul>
      </nav>

    </>
  )
}