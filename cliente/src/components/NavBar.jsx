import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { FaRegUserCircle } from "react-icons/fa";

function NavBar() {
  const auth = useAuth();
  const { email, displayName, photoURL } = auth.user || {};

  const handleLogOut = async () => {
    try {
      await auth.logOut();
      toast.success("See you later");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="p-2">
        <ul className="flex items-center justify-between">
          <li className="flex items-center gap-2">
            {auth.user ? (
              <>
                {" "}
                <img
                  src={photoURL}
                  alt="user photo"
                  className="size-16 rounded-full"
                />
                <span className="font-semibold">
                  {displayName}
                  <br />
                  {email}
                </span>
              </>
            ) : (
              <>
                <FaRegUserCircle className="size-16" />
                <span className="font-semibold">Guest</span>
              </>
            )}
          </li>
          <li>
            {auth.user ? (
              <button
                onClick={handleLogOut}
                className="bg-gray-950 hover:bg-gray-800 transition duration-300 text-white font-medium p-2 rounded"
              >
                Log out
              </button>
            ) : (
              <Link
                to={"/login"}
                className="bg-gray-950 hover:bg-gray-800 transition duration-300 text-white font-medium p-2 rounded"
              >
                Log in
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
export default NavBar;
