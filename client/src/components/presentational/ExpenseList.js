import React from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { toTitleCase } from '../../utils/StringHelpers'

function ExpenseList({ expenses, setExpenseItem, expenseEditData }) {
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
        return noRepeatingDates.map(date => {
          if (exp.startDate === date) {
            return (<Link to="/trip/expense" onClick={() => setExpenseItem({ exp, expenseEditData })} key={exp._id}  >
              <div className="flex justify-between px-10 py-3 font-light hover:bg-gray-200">
                <h4 className="text-gray-800">{toTitleCase(exp.expenseName)}</h4>
                <div className="flex justify-between text-gray-800">
                  <h4>{exp.baseCurrencyPrice}</h4> <span className="px-1">/</span>
                  <h4>{exp.foreignPrice}</h4>
                </div>
              </div>
            </Link>)
          }
        })
      }
      )
      }
    </div>
  )
}

export default ExpenseList
