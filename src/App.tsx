import { useEffect, useState } from "react";
import "./App.css";

import WebApp from "@twa-dev/sdk";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    WebApp.CloudStorage.getItem("count", (err, count) => {
      if (err || !count) {
        return 0;
      } else {
        setCount(Number(count));
      }
    });
  }, []);

  const saveCount = (num: number) => {
    WebApp.CloudStorage.setItem("count", num.toString());
    setCount(0);
  };

  return (
    <>
      <h1>Money Printer</h1>
      <div className="card">Cash: ${count}</div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Print bill
        </button>
      </div>
      <div className="card">
        <button onClick={() => saveCount(count)}>Deposit in bank</button>
      </div>
      <div className="card">
        <button
          onClick={() =>
            WebApp.showAlert(`Hello! Current balance is $${count}`)
          }
        >
          Show balance
        </button>
      </div>
    </>
  );
}

export default App;
