import { useState } from "react";
import reactLogo from "./assets/react.svg";
import twaLogo from "./assets/tapps.png";
import viteLogo from "/vite.svg";
import "./App.css";

import WebApp from "@twa-dev/sdk";

function App() {
  const [count, setCount] = useState(0);

  WebApp.CloudStorage.getItem("count", (err, count) => {
    if (err || !count) {
      return 0;
    } else {
      setCount(Number(count));
    }
  });

  const saveCount = (num: number) => {
    WebApp.CloudStorage.setItem("count", num.toString());
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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
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
      <div className="card">
        <button onClick={() => saveCount(count)}>Save count to cloud</button>
      </div>
      <div className="card">
        <button
          onClick={() =>
            WebApp.showAlert(`Hello! Current cloud count is ${count}`)
          }
        >
          Show Cloud Count
        </button>
      </div>
    </>
  );
}

export default App;
