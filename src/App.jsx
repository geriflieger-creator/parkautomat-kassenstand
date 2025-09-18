import React, { useState, useMemo } from 'react';

// Define the maximum capacities for each machine type.
// Using a structured object makes it easy to access and modify capacities.
const maxCapacities = {
  K11: {
    '10ct': 770,
    '20ct': 500,
    '50ct': 400,
    '2Euro': 380,
  },
  K12: {
    '10ct': 1000,
    '50ct': 500,
    '2Euro': 600,
  },
};

/**
 * Calculates the number of coins needed for a refill, rounded to a specific step.
 *
 * @param {string} currentCoinAmount - The current number of coins as a string.
 * @param {number} maxCapacityCoin - The maximum capacity for this coin type.
 * @param {string} coinType - The type of coin ('10ct', '20ct', etc.).
 * @returns {number | string} The numeric amount to refill, or an empty string if input is empty.
 */
const getRefillNumericValue = (currentCoinAmount, maxCapacityCoin, coinType) => {
  // If the input is empty, return an empty string to keep the UI clean.
  if (currentCoinAmount === '') {
    return '';
  }

  const parsedCurrent = parseFloat(currentCoinAmount || 0);

  // If the current amount is already at or above max capacity, no refill is needed.
  if (parsedCurrent >= maxCapacityCoin) {
    return 0;
  } else {
    const needed = maxCapacityCoin - parsedCurrent;
    let roundedNeeded;

    // Determine the rounding step based on the coin type.
    const roundingStep = (coinType === '50ct' || coinType === '2Euro') ? 50 : 100;

    // Calculate the rounded value.
    roundedNeeded = Math.round(needed / roundingStep) * roundingStep;

    // A crucial check to prevent rounding up past the needed amount.
    // If the rounded value is greater than the actual needed amount,
    // we round down to the previous multiple.
    if (roundedNeeded > needed && needed > 0) {
      roundedNeeded = Math.floor(needed / roundingStep) * roundingStep;
    }
    
    // Ensure the result is never negative.
    return Math.max(0, roundedNeeded);
  }
};

/**
 * Renders an input group for a single coin denomination, including the
 * current count, the calculated refill amount, and the new total.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.label - The label for the coin type (e.g., '10 Cent Münzen').
 * @param {string} props.coinType - The type of coin (e.g., '10ct').
 * @param {number} props.maxCapacity - The maximum capacity for this coin.
 * @param {string} props.value - The current state value for this coin input.
 * @param {Function} props.onChange - The state setter function for this coin input.
 */
const CoinInputGroup = ({ label, coinType, maxCapacity, value, onChange }) => {
  // Memoize the calculated values to prevent re-calculation on every render.
  const refillValue = useMemo(() => {
    return getRefillNumericValue(value, maxCapacity, coinType);
  }, [value, maxCapacity, coinType]);

  const refillDisplayValue = value === '' ? '' : (
    parseFloat(value || 0) >= maxCapacity ? 'Max. erreicht !!!' : refillValue
  );

  const newTotalValue = value === '' ? '' : (
    parseFloat(value || 0) + parseFloat(refillValue || 0)
  );

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label} (<span className="text-red-600 font-bold">Max: {maxCapacity}</span> Stk.):
      </label>
      <div className="grid grid-cols-3 gap-x-2">
        <div>
          <label htmlFor={`aktuelle-${coinType}`} className="block text-gray-700 text-xs mb-1">Aktuell:</label>
          <input
            type="number"
            id={`aktuelle-${coinType}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-xs text-center"
            placeholder="Stk."
            aria-label={`Anzahl ${label.split(' ')[0]} Münzen (aktuell)`}
          />
        </div>
        <div>
          <label htmlFor={`nachfuellen-${coinType}`} className="block text-gray-700 text-xs mb-1">Nachfüllen:</label>
          <input
            type="text"
            id={`nachfuellen-${coinType}`}
            value={refillDisplayValue}
            readOnly
            className="w-20 px-2 py-1 border border-gray-300 rounded-lg bg-yellow-100 text-gray-600 font-bold italic focus:outline-none text-xs text-center"
            aria-label={`Benötigte ${label.split(' ')[0]} Münzen zum Nachfüllen`}
          />
        </div>
        <div>
          <label htmlFor={`neuer-stand-${coinType}`} className="block text-gray-700 text-xs mb-1">Neuer Stand:</label>
          <input
            type="text"
            id={`neuer-stand-${coinType}`}
            value={newTotalValue}
            readOnly
            className="w-20 px-2 py-1 border border-gray-300 rounded-lg bg-lime-400 text-gray-800 font-bold focus:outline-none text-xs text-center"
            aria-label={`Neuer Stand ${label.split(' ')[0]} Münzen`}
          />
        </div>
      </div>
    </div>
  );
};

// Main component of the application
function App() {
  // State variables for K11 coin counts
  const [coin10ctK11, setCoin10ctK11] = useState('');
  const [coin20ctK11, setCoin20ctK11] = useState('');
  const [coin50ctK11, setCoin50ctK11] = useState('');
  const [coin2EuroK11, setCoin2EuroK11] = useState('');

  // State variables for K12 coin counts
  const [coin10ctK12, setCoin10ctK12] = useState('');
  const [coin50ctK12, setCoin50ctK12] = useState('');
  const [coin2EuroK12, setCoin2EuroK12] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Parkautomat Kassenstand</h1>

        {/* Input fields for K11 and K12 side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* K11 specific input with coin denominations */}
          <div className="bg-blue-100 p-6 rounded-xl shadow-inner border border-blue-300 h-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center underline">K11</h2>
            
            {/* Using the reusable CoinInputGroup component for K11 */}
            <CoinInputGroup
              label="50 Cent Münzen"
              coinType="50ct"
              maxCapacity={maxCapacities.K11['50ct']}
              value={coin50ctK11}
              onChange={setCoin50ctK11}
            />
            <CoinInputGroup
              label="20 Cent Münzen"
              coinType="20ct"
              maxCapacity={maxCapacities.K11['20ct']}
              value={coin20ctK11}
              onChange={setCoin20ctK11}
            />
            <CoinInputGroup
              label="2 Euro Münzen"
              coinType="2Euro"
              maxCapacity={maxCapacities.K11['2Euro']}
              value={coin2EuroK11}
              onChange={setCoin2EuroK11}
            />
            <CoinInputGroup
              label="10 Cent Münzen"
              coinType="10ct"
              maxCapacity={maxCapacities.K11['10ct']}
              value={coin10ctK11}
              onChange={setCoin10ctK11}
            />
          </div>

          {/* K12 specific input with coin denominations */}
          <div className="bg-purple-100 p-6 rounded-xl shadow-inner border border-purple-300 h-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center underline">K12</h2>

            {/* Using the reusable CoinInputGroup component for K12 */}
            <CoinInputGroup
              label="10 Cent Münzen"
              coinType="10ct"
              maxCapacity={maxCapacities.K12['10ct']}
              value={coin10ctK12}
              onChange={setCoin10ctK12}
            />
            <CoinInputGroup
              label="50 Cent Münzen"
              coinType="50ct"
              maxCapacity={maxCapacities.K12['50ct']}
              value={coin50ctK12}
              onChange={setCoin50ctK12}
            />
            <CoinInputGroup
              label="2 Euro Münzen"
              coinType="2Euro"
              maxCapacity={maxCapacities.K12['2Euro']}
              value={coin2EuroK12}
              onChange={setCoin2EuroK12}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
