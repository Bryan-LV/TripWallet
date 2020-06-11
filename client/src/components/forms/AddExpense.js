import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import axios from 'axios'

const initialState = {
  expense: {
    tripID: '',
    category: '',
    expenseName: '',
    foreignPrice: 0,
    baseCurrencyPrice: 0,
    startDate: '',
    endDate: '',
    spread: '',
    notes: ''
  }
}

const validation = yup.object({
  tripID: yup.string(),
  category: yup.string().required(),
  expenseName: yup.string().required(),
  foreignPrice: yup.number().required(),
  baseCurrencyPrice: yup.number().required(),
  spread: yup.number(),
  startDate: yup.string().required(),
  endDate: yup.string(),
  notes: yup.string()
})

function AddExpense({ tripID, currencies }) {
  const [price, setPrice] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault()
    // query expense
    // addExpense({ variables: {...expenseState.expense, tripID: tripID} })
    // handle completion
  }

  const handleCurrencyConversion = (value) => {
    // gets values from currency rates and maps it to an array [foreignCur, baseCur]
    const [base, foreign] = Object.entries(currencies.rates);
    const price = value / foreign[1];
    setPrice(price)
  }

  return (
    <div style={{ backgroundColor: '#757575' }}>
      <p>{price}</p>
      <Formik
        initialValues={initialState}
        validationSchema={validation}
        onSubmit={handleSubmit}>
        <Form>
          <Field type="number" name="foreignCurrency" placeholder="Price" validate={handleCurrencyConversion} />
          <ErrorMessage name="foreignCurrency" />
          <Field type="text" name="expenseName" placeholder="Expense name" />
          <ErrorMessage name="foreignCurrency" />
          <Field type="text" name="category" placeholder="Category" />
          <ErrorMessage name="category" />
          <button type="submit">Add Expense</button>
        </Form>
      </Formik>
    </div>
  )
}

export default AddExpense
