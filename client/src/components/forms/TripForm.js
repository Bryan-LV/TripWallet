import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import currencyCodes from '../../utils/currencyCodes'
import { CREATE_TRIP, UPDATE_TRIP, DELETE_TRIP, FETCH_TRIPS } from '../../queries/trips'

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
    budget: formDetails.budget,
    startDate: formDetails.startDate,
    endDate: formDetails.endDate,
    photo: formDetails.photo
  })
}

const validation = yup.object({
  tripName: yup.string().min(3).required(),
  foreignCurrency: yup.string().min(3).max(3).required(),
  baseCurrency: yup.string().min(3).max(3)
})

function TripForm({ editForm }) {
  const [createTrip] = useMutation(CREATE_TRIP, {
    onError: (err) => console.log(err),
    update: (cache, result) => {
      console.log(result);
    }
  });
  const [updateTrip] = useMutation(UPDATE_TRIP, { onError: (err) => console.log(err) });
  const [deleteTrip] = useMutation(DELETE_TRIP, { onError: (err) => console.log(err) });
  const [deleteSwitch, setDeleteSwitch] = useState(false);
  const history = useHistory();

  const handleSubmit = (values) => {
    if (editForm.isEdit) {
      updateTrip({
        variables: values
      })
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
      <Formik
        initialValues={editForm.isEdit ? editVals(editForm.formDetails) : initVals}
        validationSchema={validation}
        onSubmit={handleSubmit}>
        <Form>
          <Field type="text" name="tripName" />
          <ErrorMessage name="tripName" placeholder="trip name" />
          <Field name="foreignCurrency" as="select" placeholder="Select Currency" placeholder="foreign currency">
            {currencyCodes.map(currencyCode => <option key={currencyCode} value={currencyCode}>{currencyCode}</option>)}
          </Field>
          <ErrorMessage name="foreignCurrency" />
          <Field type="number" name="budget" placeholder="budget" />
          <Field type="text" name="startDate" placeholder="start date" />
          <Field type="text" name="endDate" placeholder="end date" />
          <Field type="text" name="photo" placeholder="photo" />
          <button type="submit">submit</button>
        </Form>
      </Formik>
      <button onClick={() => setDeleteSwitch(!deleteSwitch)}>Enable Delete Button</button>
      {deleteSwitch && editForm.isEdit && <button onClick={() => deleteTrip({ variables: { tripID: editForm.formDetails._id } })}>Delete Trip</button>}
    </div>
  )
}

export default TripForm
