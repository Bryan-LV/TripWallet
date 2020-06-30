import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { DELETE_EXPENSE } from '../../queries/expenses'
import { Link } from 'react-router-dom';
import { createDMYDate } from '../../utils/Dates'
import lockIcon from '../../assets/media/lock.svg'

function ExpenseItem({ data, setExpenseData }) {
  if (data) localStorage.setItem('expenseItem', JSON.stringify(data.exp));
  const expenseItem = data ? data.exp : JSON.parse(localStorage.getItem('expenseItem'));
  const { baseCurrency, foreignCurrency } = JSON.parse(localStorage.getItem('tripCurrencies'));

  const [unlockDelete, setDelete] = useState(false);
  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => console.log(data)
  })

  const handleDelete = () => {
    deleteExpense({ variables: { expenseID: data.exp._id } });
  }

  const handleEditExpenseRedirect = () => {
    const expenseData = { ...data.expenseEditData, expenseEditData: data.exp, isExpenseEdit: true }
    setExpenseData(expenseData)
  }

  // TODO: back to trip button
  return (
    <div>
      <div className="px-8 rounded-lg bg-white max-w-sm m-auto mb-4 mt-3 shadow-lg">
        <div className="flex flex-row justify-start items-start border-b py-4">
          <h2 className="pr-4 text-2xl">
            <span className="text-3xl font-thin">{expenseItem.foreignPrice}</span>
            <span className="pl-1 text-xs">{foreignCurrency}</span>
          </h2>
          <h2 className="text-2xl">
            <span className="text-3xl font-thin">{expenseItem.baseCurrencyPrice}</span>
            <span className="pl-1 text-xs">{baseCurrency}</span>
          </h2>
        </div>
        <h3 className=" pt-4">
          <span className="font-semibold pr-1">Name:</span>
          <span className="font-light">{expenseItem.expenseName}</span>
        </h3>
        <h3 className="my-1">
          <span className="font-semibold pr-1">Category:</span>
          <span className="font-light">{expenseItem.category}</span>
        </h3>
        {expenseItem.spread > 0 && <h3 className="py-1">{expenseItem.spread}</h3>}
        <h3 className="my-1">
          <span className="font-semibold pr-1">Start Date:</span>
          <span className="font-light">{createDMYDate(expenseItem.startDate)}</span>
        </h3>
        <h3 className="my-1">{expenseItem.endDate && createDMYDate(expenseItem.endDate)}</h3>

        <div className="flex flex-row justify-between items-end py-4">
          <div className="w-8 cursor-pointer" onClick={() => setDelete(!unlockDelete)}>
            <img src={lockIcon} alt="unlock delete button" />
          </div>
          {unlockDelete && <button className="hover:underline bg-red-600 text-white py-1 px-2 rounded-lg cursor-pointer" onClick={handleDelete}>Delete Expense</button>}
          <Link to="/trip/expenseform" className="hover:underline py-1 px-2" onClick={handleEditExpenseRedirect}>Edit Expense</Link>
        </div>
      </div>
      <Link className="mx-10 mt-4 block px-6 py-3 rounded-lg bg-gray-800 text-white " to="/trip">Back To Trip</Link>
    </div>
  )
}

export default ExpenseItem
