import imgLetterA from "../assets/imgLetterA.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function LogInView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await auth.logIn(email, password);
      const { displayName } = auth.user || {};
      navigate("/call");
      toast.success("Welcome " + displayName);
    } catch (error) {
      console.error(error);
      toast.error("We have an error with your account", {
        description: "Please try in other account",
      });
    }
  };

  const handleLogInWithGoogle = async () => {
    try {
      await auth.logInWithGoogle();
      const { displayName } = auth.user || {};
      navigate("/");
      toast.success("Welcome " + displayName);
    } catch (error) {
      console.error(error);
      toast.error("We have an error with your account", {
        description: "Please try in other account",
      });
    }
  };
  return (
    <>
      <main className="h-screen flex items-center justify-center px-5 md:px-0">
        <section className="flex flex-col border w-full md:max-w-md py-5 px-3 rounded shadow">
          <article className="flex items-center gap-1 mb-5">
            <img src={imgLetterA} alt="Letter A" className="size-8" />
            <span className="text-2xl font-medium">Auntless</span>
          </article>
          <article>
            <span className="text-lg">
              Get access with your account for a better experience
            </span>
          </article>
          <form onSubmit={handleSubmit(onSubmit)}>
            <article className="flex flex-col gap-2">
              <article className="">
                <label className="text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Campo requerido",
                  })}
                  className={`border rounded bg-gray-50 border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-1 focus:border-blue-500 transition duration-300 w-full block p-2.5 ${
                    errors.email ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </article>
              <article>
                <label className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Campo requerido",
                  })}
                  className={`border rounded bg-gray-50 border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-1 focus:border-blue-500 transition duration-300 w-full block p-2.5 ${
                    errors.password ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </article>
              <article className="flex cursor-pointer justify-center w-full mt-2 bg-blue-600 hover:bg-blue-700 transition duration-300 py-2 rounded text-white">
                <button type="submit">Log in with your account</button>
              </article>
            </article>
          </form>
          <article className="flex items-center mt-2">
            <hr className="w-2/4" />
            <span className="px-4">Or</span>
            <hr className="w-2/4" />
          </article>
          <article className="flex flex-col items-center gap-2 mt-1">
            <button
              onClick={handleLogInWithGoogle}
              className="flex items-center border gap-2 justify-center shadow rounded py-1 w-full"
            >
              <FcGoogle /> Log in with Google
            </button>
            <button className="flex items-center border gap-2 justify-center shadow rounded py-1 w-full">
              <FaApple />
              Log in with Apple
            </button>
          </article>
        </section>
      </main>
    </>
  );
}
export default LogInView;
