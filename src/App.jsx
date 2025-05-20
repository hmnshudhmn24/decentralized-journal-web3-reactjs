
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

const ipfs = create({ url: "https://ipfs.io" });

export default function App() {
  const [account, setAccount] = useState("");
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  const handleAddEntry = async () => {
    try {
      const added = await ipfs.add(entry);
      const hash = added.path;
      const newEntry = {
        hash,
        timestamp: new Date().toISOString(),
      };
      setEntries([newEntry, ...entries]);
      setEntry("");
    } catch (err) {
      console.error("IPFS upload error", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📝 Decentralized Journal</h1>
      <p className="mb-4">Connected as: <span className="text-green-400">{account}</span></p>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="w-full h-32 p-2 text-black"
        placeholder="Write your encrypted journal entry..."
      />

      <button
        onClick={handleAddEntry}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Upload to IPFS
      </button>

      <h2 className="text-xl mt-8 mb-2">📖 Your Entries</h2>
      <ul>
        {entries.map((e, idx) => (
          <li key={idx} className="mb-2">
            <a
              href={`https://ipfs.io/ipfs/${e.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {new Date(e.timestamp).toLocaleString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
