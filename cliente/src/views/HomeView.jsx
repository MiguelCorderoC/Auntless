import { Link } from "react-router-dom";
import gifHome from "../assets/gifHome.gif";

function HomeView() {
  return (
    <>
      <main className="flex flex-col items-center justify-center h-screen ">
        <img src={gifHome} alt="Logo de Auntless" className="size-72" />
        <Link
          to={"/call"}
          className="bg-green-700 hover:bg-green-800 text-white py-2.5 px-3 rounded text-lg transition duration-300"
        >
          Quick start
        </Link>
        <Link
          to={"/login"}
          className="bg-blue-600 hover:bg-blue-700 text-white mt-5 py-2.5 px-3 rounded text-lg transition duration-300"
        >
          Log In
        </Link>
      </main>
    </>
  );
}
export default HomeView;
