import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import currencyCodes from '../../utils/currencyCodes'
import { CREATE_TRIP, UPDATE_TRIP, DELETE_TRIP, FETCH_TRIPS } from '../../queries/trips'
import DatePickerField from './DatePickerField';
import "react-datepicker/dist/react-datepicker.css";

const initVals = {
  tripName: '',
  foreignCurrency: 'EUR',
  baseCurrency: localStorage.getItem('baseCurrency'),
  budget: 0,
  startDate: new Date(),
  endDate: '',
  photo: ''
}

const editVals = (formDetails) => {
  return ({
    tripID: formDetails._id,
    tripName: formDetails.tripName,
    foreignCurrency: formDetails.foreignCurrency,
    budget: formDetails.budget ? formDetails.budget : '',
    startDate: formDetails.startDate,
    endDate: formDetails.endDate ? formDetails.endDate : '',
    photo: formDetails.photo ? formDetails.photo : ''
  })
}

const validation = yup.object({
  tripName: yup.string().min(3).required('A trip name is required'),
  foreignCurrency: yup.string().min(3).max(3).required('A foreign currency is required'),
  baseCurrency: yup.string().min(3).max(3)
})

function TripForm({ isTripEdit }) {
  const history = useHistory();
  const [deleteSwitch, setDeleteSwitch] = useState(false);
  // Mutations 
  const [createTrip] = useMutation(CREATE_TRIP, {
    onError: (err) => console.log(err),
    update: (cache, { data }) => {
      const cachedTrips = cache.readQuery({ query: FETCH_TRIPS });
      const newTrip = data.CreateTrip;
      cache.writeQuery({
        query: FETCH_TRIPS,
        data: { getTrips: [...cachedTrips.getTrips, newTrip] }
      })
    }
  });
  const [updateTrip] = useMutation(UPDATE_TRIP, {
    onError: (err) => console.log(err),
    update: (cache, { data }) => {
      const cachedTrips = cache.readQuery({ query: FETCH_TRIPS });
      const newTrip = data.UpdateTrip;
      cache.writeQuery({
        query: FETCH_TRIPS,
        data: { getTrips: [...cachedTrips.getTrips, newTrip] }
      })
    }
  });
  const [deleteTrip] = useMutation(DELETE_TRIP, {
    onError: (err) => console.log(err),
    update: (cache, { data }) => {
      const cachedTrips = cache.readQuery({ query: FETCH_TRIPS });
      const filterTrips = cachedTrips.getTrips.filter(trip => trip._id !== isTripEdit.formDetails._id)
      console.log(filterTrips);
      cache.writeQuery({
        query: FETCH_TRIPS,
        data: { getTrips: filterTrips }
      })
    }
  });

  const handleSubmit = (values) => {
    if (isTripEdit.isEdit) {
      updateTrip({ variables: values })
    }
    else {
      createTrip({
        variables: values,
        update: (cache, { data }) => {
          console.log(cache);
          const existingTrips = cache.readQuery({
            query: FETCH_TRIPS
          });
          // Add the new trip to the cache
          cache.writeQuery({
            query: FETCH_TRIPS,
            data: { getTrips: [data.createTrip, ...existingTrips.getTrips] }
          });
        }
      })
      // history.push('/');/
    }
  }

  return (
    <div>
      <div>
        <h2 className="text-lg font-medium mx-10">{isTripEdit.isEdit ? `Edit ${isTripEdit.formDetails.tripName} Trip` : 'Add Trip'}</h2>
      </div>
      <Formik
        initialValues={isTripEdit.isEdit ? editVals(isTripEdit.formDetails) : initVals}
        validationSchema={validation}
        onSubmit={handleSubmit}>
        <Form className="mt-2">
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <Field type="text" name="tripName" placeholder="Trip name" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <ErrorMessage name="tripName">{(errorMsg) => <p className="mx-10 text-red-700">{errorMsg}</p>}</ErrorMessage>
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10 mb-8">
            <Field name="foreignCurrency" as="select" placeholder="Select Currency" placeholder="foreign currency" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none">
              {currencyCodes.map(currencyCode => <option key={currencyCode} value={currencyCode}>{currencyCode}</option>)}
            </Field>
          </div>
          <ErrorMessage name="foreignCurrency">{(errorMsg) => <p className="mx-10 text-red-700">{errorMsg}</p>}</ErrorMessage>
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <p className="text-md pl-2">Budget</p>
            <Field type="number" name="budget" placeholder="Budget" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <label htmlFor="startDate" className="text-md px-2">Start Date</label>
            <DatePickerField name="startDate" className="bg-transparent" />
          </div>
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <label htmlFor="startDate" className="text-md px-2">End Date</label>
            <DatePickerField name="endDate" className="bg-transparent" />
          </div>
          <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
            <Field type="text" name="photo" placeholder="Photo" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="py-3 px-6 text-lg font-medium bg-teal-400 w-3/4 md:w-1/2">Save Trip</button>
          </div>
        </Form>
      </Formik>
      {isTripEdit.isEdit && (
        <div className="text-center mt-4">
          <button
            onClick={() => setDeleteSwitch(!deleteSwitch)}
            className="py-3 px-6 text-lg font-medium bg-yellow-400 w-3/4 md:w-1/2" >
            Enable Delete Button
          </button>
        </div>
      )}
      {deleteSwitch && isTripEdit.isEdit && (
        <div className="text-center mt-4">
          <button
            onClick={() => deleteTrip({ variables: { tripID: isTripEdit.formDetails._id } })}
            className="py-3 px-6 text-lg font-medium bg-red-500 w-3/4 md:w-1/2">
            Delete Trip
          </button>
        </div>
      )}
    </div>
  )
}

export default TripForm
