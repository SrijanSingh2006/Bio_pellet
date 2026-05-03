import React, { useState } from "react";

const ReceiptGenerator = () => {
  const [farmerName, setFarmerName] = useState("");
  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const ratePerKg = 7.945;
  const today = new Date().toLocaleDateString("en-GB");

  const totalAmount = quantity ? quantity * ratePerKg : 0;

  const handleGenerateReceipt = () => {
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
            Bio-Pallet Plant Receipt Generator
          </h2>

          <div className="space-y-5">
            <div>
              <label className="font-semibold block mb-1">Farmer Name:</label>
              <input
                type="text"
                className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Crop Type:</label>
              <input
                type="text"
                className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Quantity (kg):</label>
              <input
                type="number"
                className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              onClick={handleGenerateReceipt}
            >
              Generate Receipt
            </button>
          </div>

          {showReceipt && (
            <div className="mt-8 bg-green-50 border border-green-300 p-6 rounded-lg shadow-inner print-area">
              <h5 className="text-xl font-semibold text-center text-green-800 mb-4">Receipt</h5>
              <p><b>Date:</b> {today}</p>
              <p><b>Farmer Name:</b> {farmerName}</p>
              <p><b>Crop Type:</b> {cropType}</p>
              <p><b>Quantity:</b> {quantity} kg</p>
              <p><b>Rate:</b> ₹{ratePerKg}/kg</p>
              <p><b>Total Amount:</b> ₹{totalAmount.toFixed(2)}</p>
              <button
                className="mt-4 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
                onClick={handlePrint}
              >
                🖨 Print Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReceiptGenerator;