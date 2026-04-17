import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-black shadow-md px-4 sm:px-6 py-3 flex justify-between items-center">
      
      {/* Logo */}
      <h1 className="font-bold text-white">
        {/* Mobile */}
        <span className="text-xl sm:hidden">UMS</span>

        {/* Desktop */}
        <span className="hidden sm:inline text-2xl">
          User Management System
        </span>
      </h1>

      {/* Logout */}
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-red-600 transition text-sm sm:text-base"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;