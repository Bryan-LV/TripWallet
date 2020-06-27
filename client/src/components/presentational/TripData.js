import React from 'react'
import { Link } from 'react-router-dom'
import currency from 'currency.js'
import ExpenseList from './ExpenseList'
import ProgressBar from './ProgressBar';

function TripData({ data, setTripEdit, setExpenseData, setExpenseItem }) {

  if (!data) return null;

  const formatMoney = (budget) => currency(budget, { precision: 0 }).format();

  const expenseFormRedirect = () => {
    setExpenseData({
      tripID: data.getTrip._id,
      categories: data.getTrip.categories,
      isExpenseEdit: false,
      expenseEditData: null,
      currencies: {
        baseCurrency: data.getTrip.baseCurrency,
        foreignCurrency: data.getTrip.foreignCurrency
      },
    })
  }

  const calcTotalSpent = () => {
    if (data.getTrip.expenses.length === 0) return 0
    const total = data.getTrip.expenses.reduce((acc, cur) => {
      let addExpenses = currency(acc).add(cur.baseCurrencyPrice);
      return addExpenses;
    }, 0);
    return total.value;
  }


  return (
    <div className="">

      <div>
        <h1 className="text-4xl text-center" >{data.getTrip.tripName}</h1>
        {data.getTrip.budget && <ProgressBar totalSpent={calcTotalSpent()} budget={data.getTrip.budget} />}
        <div className="flex flex-row justify-between mx-10 py-4">
          <h4>Spent {calcTotalSpent()}</h4>
          {data.getTrip.budget ? <h4>Budget {formatMoney(data.getTrip.budget)}</h4> : <h4>No Budget</h4>}
        </div>
      </div>

      <div className=" py-4 bg-green-400">
        <div className="flex flex-row justify-start mx-10">
          <h4 className="pr-2">Date</h4>
          <h4 className="">Category</h4>
        </div>
      </div>

      <ExpenseList
        expenses={data.getTrip.expenses}
        setExpenseItem={setExpenseItem}
        expenseEditData={{
          tripID: data.getTrip._id,
          categories: data.getTrip.categories,
          isExpenseEdit: false,
          expenseEditData: null,
          currencies: {
            baseCurrency: data.getTrip.baseCurrency,
            foreignCurrency: data.getTrip.foreignCurrency
          }
        }} />

      <div className="flex flex-row justify-center">
        <Link to="/trip/expenseform" onClick={expenseFormRedirect} className="inline-block  my-5 p-4 bg-green-400" >Add Expense</Link>
        <Link to="/tripform" onClick={() => setTripEdit({ isEdit: true, formDetails: data.getTrip })} className="inline-block my-5 p-4 bg-green-400">Edit Trip</Link>
      </div>
    </div>
  )
}

export default TripData
