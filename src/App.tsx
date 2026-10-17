import "./App.css";
import Hero from "./components/hero/Hero";
import About from "./components/about/About";
import Work from "./components/work/Work";
import Services from "./components/expertise/Services";

function App() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Services />
      <div style={{ height: "700px" }}></div>
    </>
  );
}

export default App;
