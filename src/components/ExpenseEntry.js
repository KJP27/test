import React from 'react';

function ExpenseEntry({ description, amount, currency, frequency, onEdit, onDelete }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded shadow mb-2">
      <div>
        <span>{description}</span>
        <small className="text-gray-500 ml-2">({frequency})</small>
      </div>
      <span>{`${amount} ${currency.toUpperCase()}`}</span>
      <div className="flex">
        <button onClick={onEdit} className="ml-2 text-blue-500">Edit</button>
        <button onClick={onDelete} className="ml-2 text-red-500">Delete</button>
      </div>
    </div>
  );
}

export default ExpenseEntry;