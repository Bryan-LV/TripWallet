import React from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

function ExpenseList({ expenses, setExpenseItem }) {
  // props receives expenses array, sort array by date
  const sortedExpenses = expenses.slice().sort((a, b) => {
    let aDate = new Date(a.startDate)
    let bDate = new Date(b.startDate);
    return dayjs(aDate).isAfter(dayjs(bDate)) ? 1 : -1
  })
  const noRepeatingDates = Array.from(new Set(sortedExpenses.map(exp => exp.startDate)));
  return (
    <div>
      {sortedExpenses.map(exp => {
        return (<Link to="/trip/expense" onClick={() => setExpenseItem(exp)} key={exp._id}  >
          <div className="flex justify-between mx-10 py-3">
            <h4>{exp.expenseName}</h4>
            <div className="flex justify-between">
              <h4>{exp.baseCurrencyPrice}</h4>/
                    <h4>{exp.foreignPrice}</h4>
            </div>
          </div>
        </Link>)
      }
      )
      }
    </div>
  )
}

export default ExpenseList
