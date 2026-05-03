import React, { useState, useEffect, useRef } from 'react';
import { FaLink, FaCube } from 'react-icons/fa';

const CarbonLedger = () => {
  const [blocks, setBlocks] = useState([]);
  const bottomRef = useRef(null);

  // Generate synthetic SHA-256 looking hash
  const generateHash = () => {
    return Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
  };

  useEffect(() => {
    // Initial genesis block
    const genesis = {
      id: 0,
      timestamp: new Date().toISOString(),
      plantId: 'SYSTEM',
      tonnes: 0,
      co2Saved: 0,
      hash: generateHash(),
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000'
    };
    setBlocks([genesis]);

    // Simulate live blockchain mining
    const interval = setInterval(() => {
      setBlocks(prev => {
        const lastBlock = prev[prev.length - 1];
        const tonnes = Math.floor(Math.random() * 50) + 10;
        const newBlock = {
          id: prev.length,
          timestamp: new Date().toISOString(),
          plantId: `PLANT-${Math.floor(Math.random() * 90) + 10}`,
          tonnes: tonnes,
          co2Saved: tonnes * 2.42, // CCTS baseline conversion
          hash: generateHash(),
          prevHash: lastBlock.hash
        };
        return [...prev.slice(-49), newBlock]; // Keep last 50 blocks to prevent memory leak
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [blocks]);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl flex flex-col h-96">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <FaLink className="animate-pulse" />
          <h3 className="font-black tracking-widest text-sm">CARBON LEDGER</h3>
        </div>
        <div className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          NETWORK SYNCED
        </div>
      </div>

      {/* Terminal Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] sm:text-xs bg-black text-gray-300 space-y-4">
        {blocks.map(block => (
          <div key={block.id} className="border-l-2 border-gray-700 pl-3 py-1 hover:border-emerald-500 transition-colors">
            <div className="flex justify-between items-start text-gray-500 mb-1">
              <span>[{block.timestamp}]</span>
              <span className="flex items-center gap-1 text-emerald-500"><FaCube /> BLOCK #{block.id}</span>
            </div>
            <div className="text-gray-400 truncate">
              Prev: <span className="text-gray-600">{block.prevHash}</span>
            </div>
            <div className="text-gray-200 mt-1">
              <span className="text-blue-400">TX:</span> {block.plantId} processed <span className="text-yellow-400 font-bold">{block.tonnes}t</span> biomass.
            </div>
            <div className="text-emerald-400 font-bold mt-1">
              + {block.co2Saved.toFixed(2)} Carbon Credits Minted
            </div>
            <div className="text-gray-400 truncate mt-1">
              Hash: <span className="text-gray-200">{block.hash}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default CarbonLedger;
