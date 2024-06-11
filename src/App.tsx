import { useState } from "react";
import reactLogo from "./assets/react.svg";
import twaLogo from "./assets/tapps.png";
import viteLogo from "/vite.svg";
import "./App.css";

import WebApp from "@twa-dev/sdk";

function App() {
  const initialCount = Number(WebApp.CloudStorage.getItem("count")) || 0;

  const [count, setCount] = useState(initialCount);

  const handleMainButtonClick = () => {
    setCount((count) => count + 1);
    WebApp.CloudStorage.setItem("count", count.toString());
  };

  return (
    <>
      <div>
        <a href="https://ton.org/dev" target="_blank">
          <img src={twaLogo} className="logo" alt="TWA logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>TWA + Vite + React</h1>
      <div className="card">
        <button onClick={() => handleMainButtonClick}>count is {count}</button>
      </div>
      {/*  */}
      <div className="card">
        <button
          onClick={() =>
            WebApp.showAlert(`Hello World! Current count is ${count}`)
          }
        >
          Show Alert
        </button>
      </div>
    </>
  );
}

export default App;
