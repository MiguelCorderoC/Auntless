import { useAuth } from "../context/AuthContext";

function LogInWithGoogleButton() {
  const auth = useAuth();

  const handleLogInWithGoogle = async () => {
    try {
      await auth.logInWithGoogle();
    } catch (error) {
      console.error("Error de credenciales Google:" + error);
    }
  };

  const handleLogOut = async () => {
    auth.logOut();
  };

  return (
    <>
      {auth.user ? (
        <button className="btn btn-dark" onClick={handleLogOut}>
          Log Out
        </button>
      ) : (
        <button className="btn btn-dark" onClick={handleLogInWithGoogle}>
          Log In
        </button>
      )}
    </>
  );
}

export default LogInWithGoogleButton;
