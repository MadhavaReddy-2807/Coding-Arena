"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Contest1() {
  const [registrationType, setRegistrationType] = useState(null);

  const handleRegister = (type) => {
    setRegistrationType(type);
    alert(`You have registered as ${type}!`);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">🏆 Code Rush</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl">
        Sharpen your problem-solving skills with a variety of algorithmic and logical challenges designed to test your thinking speed and accuracy.
      </p>

      {/* Registration Options */}
      <div className="mt-6 space-x-4">
        <Button onClick={() => handleRegister("Solo")} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700">
          Register Solo
        </Button>
        <Button onClick={() => handleRegister("Group")} className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700">
          Register as Group
        </Button>
      </div>

      {/* Display Selected Registration Type */}
      {registrationType && (
        <p className="mt-4 text-xl font-semibold text-gray-800">
          ✅ You have chosen: <span className="text-blue-600">{registrationType}</span>
        </p>
      )}

      {/* Footer */}
      <div className="text-center mt-12 text-lg text-gray-700 font-semibold">
        "Keep coding, keep improving, and never stop challenging yourself! 🚀"
      </div>
    </div>
  );
}
