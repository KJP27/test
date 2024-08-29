import React, { useState } from 'react';

function ExpenseInput({ onAddExpense }) {
  const [input, setInput] = useState('');
  const [frequency, setFrequency] = useState('Single payment');

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!value.match(/^[0-9a-zA-Z\s$€£]*$/)) {
      alert('Invalid input');
      return;
    }
    setInput(value);
  };

  const handleAddExpense = () => {
    const expense = parseExpenseInput(input);
    expense.frequency = frequency;
    onAddExpense(expense);
    setInput('');
  };

  function parseExpenseInput(input) {
    const currencyRegex = /(USD|EUR|THB|GBP|AUSD|usd|eur|thb|gbp|ausd)/i;
    const amountRegex = /(\d+(\.\d{1,2})?)/;
    const currencyMatch = input.match(currencyRegex);
    const amountMatch = input.match(amountRegex);

    const currency = currencyMatch ? currencyMatch[0].toUpperCase() : 'USD';
    const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;
    const description = input.replace(currencyRegex, '').replace(amountRegex, '').trim();

    return { currency, amount, description };
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        className="border p-2 mb-4 w-full shadow-lg"
        placeholder="Enter expense (e.g., Chocolate 150 THB/usd/$/gbp/ausd)"
      />
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="border p-2 w-full mb-4 shadow-lg"
      >
        <option>Single payment</option>
        <option>Annual</option>
        <option>Monthly</option>
        <option>Bi-weekly</option>
        <option>Weekly</option>
        <option>Daily</option>
      </select>
      <button
        onClick={handleAddExpense}
        className="bg-blue-500 text-white p-2 rounded shadow-lg"
      >
        Add Expense
      </button>
    </div>
  );
}

export default ExpenseInput;
