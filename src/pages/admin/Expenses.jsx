// components/ExpensesPage.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchExpenses,
     addExpense,
      updateExpense, 
      deleteExpense
     } from "../../store/expenses/expenseSlice";

const Expenses = () => {
  const dispatch = useDispatch();
  const { expenses, status, error } = useSelector((state) => state.expense);
  
  const [newExpense, setNewExpense] = useState({
    expenses_name: "",
    expenses_amount: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = () => {
    if (newExpense.expenses_name && newExpense.expenses_amount) {
      dispatch(addExpense(newExpense));
      setNewExpense({ expenses_name: "", expenses_amount: "" });
    }
  };

  const handleEditExpense = (id) => {
    setEditMode(true);
    const expense = expenses.find((exp) => exp._id === id);
    setNewExpense({
      expenses_name: expense.expenses_name,
      expenses_amount: expense.expenses_amount,
    });
    setCurrentExpenseId(id);
  };

  const handleSaveEdit = () => {
    if (newExpense.expenses_name && newExpense.expenses_amount) {
      dispatch(updateExpense({ id: currentExpenseId, expenseData: newExpense }));
      setEditMode(false);
      setNewExpense({ expenses_name: "", expenses_amount: "" });
      setCurrentExpenseId(null);
    }
  };

  const handleDeleteExpense = (id) => {
    dispatch(deleteExpense(id));
  };

  return (
    <div>
      <h2>Expense Management</h2>
      <div>
        <input
          type="text"
          name="expenses_name"
          value={newExpense.expenses_name}
          onChange={handleChange}
          placeholder="Expense Name"
        />
        <input
          type="number"
          name="expenses_amount"
          value={newExpense.expenses_amount}
          onChange={handleChange}
          placeholder="Amount"
        />
        {editMode ? (
          <button onClick={handleSaveEdit}>Save</button>
        ) : (
          <button onClick={handleAddExpense}>Add Expense</button>
        )}
      </div>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Amount</th>
            <th>Revenue Generated</th>
            <th>Revenue Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.expenses_name}</td>
              <td>${expense.expenses_amount.toFixed(2)}</td>
              <td>${expense.revenue_generated.toFixed(2)}</td>
              <td>${expense.revenue_balance.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEditExpense(expense._id)}>Edit</button>
                <button onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;
