import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useHistory, Route, Link } from 'react-router-dom'
import Axios from 'axios'

import { FETCH_TRIP } from '../../queries/trips'
import AddExpense from '../forms/AddExpense';

function Trip({ trip, setEditForm }) {
  let tripID = trip !== null ? trip._id : JSON.parse(localStorage.getItem('tripID'));
  const history = useHistory();
  const [currencies, setCurrencies] = useState(null);
  const { error, data } = useQuery(FETCH_TRIP, { variables: { id: tripID } });

  useEffect(() => {
    let tripID = localStorage.getItem('tripID');
    if (!tripID && trip === null) {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    async function getCurrencies() {
      // check if rates are already in local storage
      let rates = localStorage.getItem('rates') ? JSON.parse(localStorage.getItem('rates')) : false;
      // if true then use those rates 
      if (rates) {
        setCurrencies(rates);
        return
      } else {
        // fetch currencies
        const req = await Axios.get(`https://api.exchangeratesapi.io/latest?base=${trip.baseCurrency}&symbols=${trip.baseCurrency},${trip.foreignCurrency}`);
        setCurrencies(req.data);
        // set rates to local storage
        localStorage.setItem('rates', JSON.stringify(req.data));
      }
    }
    getCurrencies()

  }, [])

  // TODO: handle error
  if (error) console.log(error);

  return (
    <div >
      {data && (
        <div>
          <h3>{data.getTrip.tripName}</h3>
          <h4>Spent so far</h4>
        </div>
      )}

      <Link to="/trip/addexpense">Add Expense</Link><br />
      <Link to="/trip/addcategory">Add Category</Link><br />
      <Link to="/tripform" onClick={() => setEditForm({ isEdit: true, formDetails: data.getTrip })}>Edit Trip</Link>

      <Route path="/trip/addexpense" exact >
        <AddExpense
          tripID={tripID}
          currencies={currencies} />
      </Route>
      <Route path="/trip/addcategory" exact >
        <h2>Add Category</h2>
      </Route>
    </div>
  )
}

export default Trip
