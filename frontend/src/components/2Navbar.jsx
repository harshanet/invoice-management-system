import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBoxOpen,
} from "react-icons/fa";

const Navbar = ({ cartCount }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Logout user and go back to login page
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-3">
      <div className="container">

        <Link
          to="/products"
          className="navbar-brand fw-bold text-success fs-3 d-flex align-items-center gap-2"
        >
          🛒 Grocery Delivery Platform
        </Link>

        <div className="d-flex align-items-center gap-4">

          <Link
            to="/products"
            className="nav-link text-dark fw-semibold"
          >
            Products
          </Link>

          {/* Guest user */}
          {!user && (
            <>
              <Link
                to="/cart"
                className="nav-link text-dark position-relative"
              >
                <FaShoppingCart size={22} />

                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                    style={{ fontSize: "10px" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/login"
                className="nav-link text-dark fw-semibold"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-success px-4 fw-semibold"
              >
                Register
              </Link>
            </>
          )}

          {/* Customer user */}
          {user && user.role === "customer" && (
            <>
              <Link
                to="/cart"
                className="nav-link text-dark position-relative"
              >
                <FaShoppingCart size={22} />

                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                    style={{ fontSize: "10px" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="nav-link text-dark"
              >
                <FaUserCircle size={24} />
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger px-4 fw-semibold"
              >
                Logout
              </button>
            </>
          )}

          {/* Admin user */}
          {user && user.role === "admin" && (
            <>
              <Link
                to="/admin/products"
                className="nav-link text-dark fw-semibold d-flex align-items-center gap-2"
              >
                <FaBoxOpen />
                Admin
              </Link>

              <Link
                to="/profile"
                className="nav-link text-dark"
              >
                <FaUserCircle size={24} />
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger px-4 fw-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;