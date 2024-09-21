import { useAuth } from "../context/AuthContext";
import LogInWithGoogleButton from "./LogInWithGoogleButton";
import "./styles/Profile.css";

function Profile() {
  const auth = useAuth();
  const { displayName, photoURL } = auth.user || {};

  return (
    <>
      {auth.user ? (
        <nav className="container mb-2 nav-Profile">
          <article className="d-flex flex-columns align-items-center justify-content-between gap-2">
            <article className="d-flex align-items-center gap-2">
              <img src={photoURL} alt="photo user" width={50} />
              <strong>{displayName}</strong>
            </article>
            <article>
              <LogInWithGoogleButton />
            </article>
          </article>
        </nav>
      ) : (
        <>
          <nav className="container mb-2 nav-Profile">
            <article className="d-flex flex-columns align-items-center justify-content-between gap-2">
              <article className="d-flex align-items-center gap-2">
                <img src="/iconUser.png" alt="Sin usuario" width={50} />
                <strong>Guest</strong>
              </article>
              <article>
                <LogInWithGoogleButton />
              </article>
            </article>
          </nav>
        </>
      )}
    </>
  );
}
export default Profile;
