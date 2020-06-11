import React from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'

import { FETCH_TRIPS } from '../../queries/trips'

function Trips({ setTrip }) {
  // query user trip
  const { loading, error, data } = useQuery(FETCH_TRIPS);
  const history = useHistory();
  if (error) console.log(error);

  const selectTrip = (trip) => {
    // set Trip
    setTrip(trip);
    // set trip id to local storage
    localStorage.setItem('tripID', JSON.stringify(trip._id));
    // FIXME: Maybe useful later on?
    localStorage.setItem('tripCurrencies', JSON.stringify({ baseCurrency: trip.baseCurrency, foreignCurrency: trip.foreignCurrency }));
    // send user to trip page
    history.push('/trip');
  }


  return (
    <div>
      {data && data.getTrips.map(trip => {
        return (
          <div key={trip._id} onClick={() => selectTrip(trip)}>
            <p>{trip.tripName}</p>
            <p>Daily spend</p>
          </div>
        )
      })}
    </div >
  )
}

export default Trips
