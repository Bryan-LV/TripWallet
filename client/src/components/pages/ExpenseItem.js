import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { DELETE_EXPENSE } from '../../queries/expenses'
import { Link } from 'react-router-dom';

function ExpenseItem({ data, setExpenseData }) {
  const [unlockDelete, setDelete] = useState(false);
  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => console.log(data)
  })
  // TODO: add delete & edit expense
  const handleDelete = () => {
    deleteExpense({ variables: { expenseID: data._id } });
  }
  const handleEditExpenseRedirect = () => {
    const expenseData = { ...data.expenseEditData, expenseEditData: data.exp, isExpenseEdit: true }
    setExpenseData(expenseData)
  }


  // TODO: back to trip button
  return (
    <div>
      <h3>{data.exp.expenseName}</h3>
      <h3>{data.exp.category}</h3>
      <h3>{data.exp.foreignPrice}</h3>
      <h3>{data.exp.baseCurrencyPrice}</h3>
      <h3>{data.exp.spread}</h3>
      <h3>{data.exp.startDate}</h3>
      <h3>{data?.exp.endDate}</h3>

      <div className="">
        <button onClick={() => setDelete(!unlockDelete)}>Unlock</button>
        {unlockDelete && <button onClick={handleDelete}>Delete Expense</button>}
        <Link to="/trip/expenseform" onClick={handleEditExpenseRedirect}>Edit Expense</Link>
      </div>
    </div>
  )
}

export default ExpenseItem
