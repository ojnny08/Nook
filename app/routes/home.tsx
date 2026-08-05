import NavBar from "~/components/NavBar";
import type { Route } from "./+types/home";

export default function Home() {
  return (
      <div className="home">
        <NavBar />
        <h1>Home</h1>
      </div>
  );
}
