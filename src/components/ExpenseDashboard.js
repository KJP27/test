import React, { useState } from 'react';
import ExpenseEntry from './ExpenseEntry';

function ExpenseDashboard({ expenses }) {
  const [currency, setCurrency] = useState('USD');
  const [frequency, setFrequency] = useState('Monthly');

  const conversionRates = {
    USD: 1,
    EUR: 0.85,
    THB: 33.5,
    GBP: 0.75,
    AUSD: 1.35,
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const fromRate = conversionRates[fromCurrency.toUpperCase()] || 1;
    const toRate = conversionRates[toCurrency.toUpperCase()] || 1;
    return (amount / fromRate) * toRate;
  };

  const getMultiplier = (expenseFrequency, selectedFrequency) => {
    const daysInMonth = 30; // Simplified, you can use a library like date-fns for accurate days
    const weeksInMonth = 4;
    const daysInWeek = 7;

    switch (selectedFrequency) {
      case 'Monthly':
        if (expenseFrequency === 'Daily') return daysInMonth;
        if (expenseFrequency === 'Bi-weekly') return weeksInMonth / 2;
        if (expenseFrequency === 'Weekly') return weeksInMonth;
        return 1;
      case 'Weekly':
        if (expenseFrequency === 'Daily') return daysInWeek;
        if (expenseFrequency === 'Bi-weekly') return 0.5;
        return 1;
      case 'Daily':
        return 1;
      case 'Annual':
        return 1;
      default:
        return 1;
    }
  };

  const filterExpensesByFrequency = (expenses, frequency) => {
    return expenses.filter(expense => {
      if (frequency === 'Annual') return true;
      if (frequency === 'Monthly') return ['Monthly', 'Bi-weekly', 'Weekly', 'Daily', 'Single payment'].includes(expense.frequency);
      if (frequency === 'Weekly') return ['Weekly', 'Bi-weekly', 'Daily', 'Single payment'].includes(expense.frequency);
      if (frequency === 'Daily') return ['Daily', 'Single payment'].includes(expense.frequency);
      return false;
    });
  };

  const filteredExpenses = filterExpensesByFrequency(expenses, frequency);

  const totalExpenses = filteredExpenses.reduce((total, expense) => {
    const multiplier = getMultiplier(expense.frequency, frequency);
    return total + convertCurrency(expense.amount * multiplier, expense.currency, currency);
  }, 0);

  return (
    <div className="p-4 w-full max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border p-2 mb-4 md:mb-0 md:mr-4 w-full md:w-auto"
        >
          <option>USD</option>
          <option>EUR</option>
          <option>THB</option>
          <option>GBP</option>
          <option>AUSD</option>
        </select>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="border p-2 w-full md:w-auto"
        >
          <option>Annual</option>
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>
      <div>
        {filteredExpenses.map((expense, index) => (
          <ExpenseEntry
            key={index}
            description={expense.description}
            amount={convertCurrency(expense.amount * getMultiplier(expense.frequency, frequency), expense.currency, currency).toFixed(2)}
            currency={currency}
            frequency={expense.frequency}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
      <div className="mt-4">
        <h2>Total Expenses: {totalExpenses.toFixed(2)} {currency}</h2>
      </div>
    </div>
  );
}

export default ExpenseDashboard;