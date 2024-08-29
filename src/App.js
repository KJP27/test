import React, { useState } from 'react';
import './App.css';
import ExpenseInput from './components/ExpenseInput';
import ExpenseDashboard from './components/ExpenseDashboard';

function App() {
  const [lists, setLists] = useState([{ name: 'List 1', expenses: [] }]);
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState('Monthly');

  const conversionRates = {
    USD: 1,
    EUR: 0.85,
    THB: 33.5,
    GBP: 0.75,
    AUSD: 1.35,
  };

  const addExpense = (expense) => {
    const newLists = [...lists];
    newLists[currentListIndex].expenses.push(expense);
    setLists(newLists);
  };

  const addNewList = () => {
    const newListName = `List ${lists.length + 1}`;
    setLists([...lists, { name: newListName, expenses: [] }]);
    setCurrentListIndex(lists.length);
  };

  const handleListNameChange = (e) => {
    const newLists = [...lists];
    newLists[currentListIndex].name = e.target.value;
    setLists(newLists);
  };

  const goToPreviousList = () => {
    if (currentListIndex > 0) {
      setCurrentListIndex(currentListIndex - 1);
    }
  };

  const goToNextList = () => {
    if (currentListIndex < lists.length - 1) {
      setCurrentListIndex(currentListIndex + 1);
    }
  };

  const getMultiplier = (expenseFrequency, selectedFrequency) => {
    const daysInMonth = 30; // Simplified, you can use a library like date-fns for accurate days
    const weeksInMonth = 4;
    const daysInWeek = 7;
    const monthsInYear = 12;

    switch (selectedFrequency) {
      case 'Monthly':
        if (expenseFrequency === 'Daily') return daysInMonth;
        if (expenseFrequency === 'Bi-weekly') return weeksInMonth / 2;
        if (expenseFrequency === 'Weekly') return weeksInMonth;
        if (expenseFrequency === 'Annual') return 1 / monthsInYear;
        return 1;
      case 'Yearly':
        if (expenseFrequency === 'Daily') return daysInMonth * monthsInYear;
        if (expenseFrequency === 'Bi-weekly') return (weeksInMonth / 2) * monthsInYear;
        if (expenseFrequency === 'Weekly') return weeksInMonth * monthsInYear;
        if (expenseFrequency === 'Monthly') return monthsInYear;
        return 1;
      default:
        return 1;
    }
  };

  const calculateTotalExpenses = (expenses, currency, view) => {
    return expenses.reduce((total, expense) => {
      const multiplier = getMultiplier(expense.frequency, view);
      const fromRate = conversionRates[expense.currency] || 1;
      const toRate = conversionRates[currency] || 1;
      return total + (expense.amount * multiplier / fromRate) * toRate;
    }, 0);
  };

  const combinedTotalExpenses = lists.reduce((total, list) => {
    return total + calculateTotalExpenses(list.expenses, 'USD', view);
  }, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">EXPENSES</h1>
      <ExpenseInput onAddExpense={addExpense} />
      <div className="flex items-center mt-4">
        {currentListIndex > 0 && (
          <button
            onClick={goToPreviousList}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&lt;</span>
          </button>
        )}
        {isEditing ? (
          <input
            type="text"
            value={lists[currentListIndex].name}
            onChange={handleListNameChange}
            onBlur={() => setIsEditing(false)}
            className="border p-2 shadow-lg"
          />
        ) : (
          <h2
            className="text-2xl font-semibold cursor-pointer text-white"
            onClick={() => setIsEditing(true)}
          >
            {lists[currentListIndex].name}
          </h2>
        )}
        {currentListIndex < lists.length - 1 && (
          <button
            onClick={goToNextList}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&gt;</span>
          </button>
        )}
        <button
          onClick={addNewList}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
      <ExpenseDashboard expenses={lists[currentListIndex].expenses} />
      <div className="fixed bottom-0 left-0 p-4 bg-white shadow-lg w-full md:w-1/4">
        <h3 className="text-xl font-bold mb-2">Expense Lists</h3>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
        <ul>
          {lists.map((list, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{list.name}</span>
              <span>{calculateTotalExpenses(list.expenses, 'USD', view).toFixed(2)} USD</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-2">
          <h4 className="text-lg font-bold">Total Expenses ({view})</h4>
          <p>{combinedTotalExpenses.toFixed(2)} USD</p>
        </div>
      </div>
    </div>
  );
}

export default App;