import { useEffect, useState } from "react";
import "./App.css";

import WebApp from "@twa-dev/sdk";

function App() {
  const [count, setCount] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetch() {
      const bal = await fetchBalance();
      if (bal) {
        setBalance(bal);
      }
    }
    fetch();
  }, []);

  const getBalance = async (): Promise<number> => {
    return new Promise((resolve, reject) => {
      WebApp.CloudStorage.getItem("count", (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count ? parseInt(count) : 0);
        }
      });
    });
  };

  const fetchBalance = async () => {
    try {
      const balance = await getBalance();
      return balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const saveCount = (num: number) => {
    WebApp.CloudStorage.setItem("count", (num + balance).toString());
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
          onClick={() => {
            getBalance();
            WebApp.showAlert(`Hello! Current balance is $${balance}`);
          }}
        >
          Show bank balance
        </button>
      </div>
    </>
  );
}

export default App;
