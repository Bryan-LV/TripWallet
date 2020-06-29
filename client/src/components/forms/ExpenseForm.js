import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import DatePickerField from './DatePickerField'
import { useMutation } from '@apollo/client';
import currencyjs from 'currency.js'
import * as yup from 'yup';
import Axios from 'axios'
import dayjs from 'dayjs'

import { createYMDDate } from '../../utils/Dates'
import { CREATE_EXPENSE, UPDATE_EXPENSE } from '../../queries/expenses'
import { FETCH_TRIP } from '../../queries/trips'

const initFormValues = (tripID, expenseEditData) => {
  let initialValues
  if (expenseEditData) {
    initialValues = {
      tripID: tripID, // should always have tripid
      category: expenseEditData.category,
      expenseName: expenseEditData.expenseName,
      foreignPrice: expenseEditData.foreignPrice,
      baseCurrencyPrice: expenseEditData.baseCurrencyPrice,
      startDate: expenseEditData.startDate,
      endDate: expenseEditData.endDate,
      spread: expenseEditData.spread,
      notes: expenseEditData.notes
    }
  }
  else {
    initialValues = {
      tripID: tripID, // should always have tripid
      category: '',
      expenseName: '',
      foreignPrice: 0,
      baseCurrencyPrice: 0,
      startDate: dayjs(),
      endDate: '',
      spread: 0,
      notes: ''
    }

  }
  return initialValues;
}

const validation = yup.object({
  tripID: yup.string(),
  category: yup.string().trim().required(),
  expenseName: yup.string().trim().required(),
  foreignPrice: yup.number().required(),
  baseCurrencyPrice: yup.number(),
  spread: yup.number(),
  startDate: yup.string().required(),
  endDate: yup.string(),
  notes: yup.string()
})

function ExpenseForm({ expenseData: { tripID, currencies, categories, isExpenseEdit, expenseEditData } }) {
  const [conversionPrice, setConversionPrice] = useState(isExpenseEdit ? expenseEditData.baseCurrencyPrice : 0);
  const [isSpread, setSpread] = useState(false); // expense spread over mult. days
  const [exchangeRate, setExchangeRate] = useState(null);
  const history = useHistory();
  // Mutations
  const [addExpense] = useMutation(CREATE_EXPENSE, {
    onError: err => console.log(err),
    // onCompleted: data => history.push('/trip'),
    update: (cache, { data }) => {
      const cachedTrip = cache.readQuery({ query: FETCH_TRIP });
      console.log(cachedTrip);
      // cache.writeQuery({
      //   query: FETCH_TRIP,
      //   data: { getTrip: { ...cachedTrip.getTrip, expenses: cachedTrip.getTrip.expenses.push(data.createExpense) } }
      // })
    }
  })

  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
    onError: (err) => console.log(err)
  })

  const fetchExchangeRate = async () => {
    const req = await Axios.get(`https://api.exchangeratesapi.io/latest?base=${currencies.baseCurrency}&symbols=${currencies.baseCurrency},${currencies.foreignCurrency}`);
    setExchangeRate({ ...req.data, dateFetched: createYMDDate() });
    localStorage.setItem('rates', JSON.stringify({ ...req.data, dateFetched: createYMDDate() }));
  }

  useEffect(() => {
    function getCurrency() {
      let rates = localStorage.getItem('rates') ? JSON.parse(localStorage.getItem('rates')) : false;
      if (!rates) {
        // if no rates, hit the api & set to local storage
        console.log('no rates');
        fetchExchangeRate()
        return;
      }
      // if there are rates, then loop through rates in object, check if foreignCurrency in props matches FC in rates obj
      let currencyIsCorrect;
      for (const currency in rates.rates) {
        if (currency == currencies.foreignCurrency) {
          currencyIsCorrect = true;
        }
      }
      if (!currencyIsCorrect) {
        console.log('currency is not correct');
        // if it does not match hit api
        fetchExchangeRate()
        return;
      }

      // if it matches, then check the date, if passed one day, hit api again
      const today = createYMDDate();
      if (today !== rates.dateFetched) {
        console.log('dates do not match');
        fetchExchangeRate();
        return;
      }
      // if it passes both match and day expiration then use those rates
      setExchangeRate(rates);
    }

    getCurrency()

  }, [])


  const handleSubmit = (formData) => {
    // convert baseCurrencyPrice to number
    formData.baseCurrencyPrice = +conversionPrice;
    const formatForeignCurrency = currencyjs(formData.foreignPrice, { precision: 2 }).format();
    formData.foreignPrice = +formatForeignCurrency;
    // check end date is earlier before start date
    if (formData.endDate) {
      const checkDates = dayjs(formData.endDate).isAfter(formData.startDate);
      if (!checkDates) {
        // TODO: Throw error
        console.error('end date is before start date');
        return;
      }
      // calculate spread by difference in start and end date
      const diffInDays = dayjs(formData.endDate).diff(formData.startDate, 'day');
      formData.spread = diffInDays;
    }

    if (isExpenseEdit) {
      // build expense edit object
      // expenseID, tripID, category, expenseName, foreignPrice, baseCurrencyPrice, spread, endDate, notes
      const expenseEdit = {
        tripID: tripID,
        expenseID: expenseEditData._id,
      }
      if (formData.expenseName !== expenseEditData.expenseName) expenseEdit.expenseName = formData.expenseName
      if (formData.category !== expenseEditData.category) expenseEdit.category = formData.category
      if (formData.foreignPrice !== expenseEditData.foreignPrice) expenseEdit.foreignPrice = formData.foreignPrice
      if (formData.baseCurrencyPrice !== expenseEditData.baseCurrencyPrice) expenseEdit.baseCurrencyPrice = formData.baseCurrencyPrice
      if (formData.startDate !== expenseEditData.startDate) expenseEdit.startDate = JSON.stringify(formData.startDate);
      if (formData.endDate !== expenseEditData.endDate) expenseEdit.endDate = JSON.stringify(formData.endDate);
      if (formData.spread !== expenseEditData.spread) expenseEdit.spread = formData.spread
      if (formData.notes !== expenseEditData.notes) expenseEdit.notes = formData.notes
      updateExpense({ variables: expenseEdit });

    } else {
      addExpense({ variables: formData })
    }
    history.push('/trip');
  }

  const handleCurrencyConversion = (value) => {
    let foreignCur;
    for (const cur in exchangeRate.rates) {
      if (cur == currencies.foreignCurrency) {
        foreignCur = exchangeRate.rates[cur];
      }
    }
    const price = value / foreignCur;
    const formatPrice = currencyjs(price).format();
    setConversionPrice(formatPrice)
  }

  return (
    <div className="px-8">
      <h3 className="">{isExpenseEdit ? 'Edit Expense' : 'Add Expense'}</h3>
      <Formik
        initialValues={initFormValues(tripID, expenseEditData)}
        validationSchema={validation}
        onSubmit={handleSubmit}>
        <Form className="w-full max-w-sm">

          <div className="flex items-center border-b border-b-2 border-gray-100 py-2">
            <label htmlFor="foreignPrice" className="pl-2">{currencies.foreignCurrency}</label>
            <Field type="number" name="foreignPrice" placeholder="Price" validate={handleCurrencyConversion} className="appearance-none bg-transparent border-none w-1/3 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
            <p>{currencies.baseCurrency}</p>
            <p className="mx-10">{conversionPrice}</p>
          </div>
          <ErrorMessage name="foreignPrice" className="py-2 text-red-700" />

          <div className="flex items-center border-b border-b-2 border-gray-100 py-2">
            <Field type="text" name="expenseName" placeholder="Expense name" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="expenseName" className="py-2 text-red-700" />

          <div className="flex items-center border-b border-b-2 border-gray-100 py-2">
            <Field type="text" name="category" placeholder="Category" list="category" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
            <datalist id="category">
              {categories ? (categories.map(category => <option key={category} value={category}>{category}</option>)) : <> <option value="Food">Food</option> <option value="Accommodation">Accommodation</option> </>}
            </datalist>
          </div>
          <ErrorMessage name="category" className="py-2 text-red-700" />

          <div className="flex items-center border-b border-b-2 border-gray-900 py-2">
            <label htmlFor="startDate" className="text-md px-2">Date</label>
            <DatePickerField name="startDate" className="bg-transparent" />
          </div>
          <ErrorMessage name="startDate" className="py-2 text-red-700" />

          <p className="px-6 py-3 my-3 bg-blue-500 rounded-lg inline-block text-right cursor-pointer" onClick={() => setSpread(!isSpread)}>Spread</p>

          {isSpread ? (
            <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mt-4">
              <label htmlFor="endDate" className="text-md px-2">End Date</label>
              <DatePickerField name="endDate" className="bg-transparent" />
            </div>) : null}
          <ErrorMessage name="endDate" className="py-2 text-red-700" />

          <div className="flex items-center border-b border-b-2 border-gray-100 py-2">
            <Field type="text" name="notes" placeholder="Notes" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="notes" className="py-2 text-red-700" />

          <button type="submit">{isExpenseEdit ? 'Save Edit' : 'Add Expense'}</button>
        </Form>
      </Formik>
    </div>
  )
}

export default ExpenseForm
