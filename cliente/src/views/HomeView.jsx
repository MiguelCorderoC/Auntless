import { Link } from "react-router-dom";
import "./styles/HomeView.css";

function HomeView() {
  return (
    <>
      <main className="container main-HomeView">
        <section>
          <img src="/gifLogo.gif" alt="Logo de la app" />
        </section>
        <section>
          <article>
            <Link to={"/call"} className="btn btn-success">
              Translate your speech
            </Link>
          </article>
        </section>
        <p></p>
        <section>
          <article>
            <button className="btn btn-primary">
              Practice your English with our AI Chat
            </button>
          </article>
        </section>
      </main>
    </>
  );
}
export default HomeView;
