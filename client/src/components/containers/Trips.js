import React from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { FETCH_TRIPS } from '../../queries/trips'
import * as dayjs from 'dayjs'

import langkawi from '../../assets/media/langkawi.jpg'

function Trips({ setTrip }) {
  // query user trip
  const { error, data } = useQuery(FETCH_TRIPS);
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

  // FIXME: utility function CreateYMD does this for us already
  const setDates = (startDate, endDate) => {
    const startYear = dayjs(startDate).get('y');
    const startMonth = dayjs(startDate).get('M');
    const startDay = dayjs(startDate).get('date');
    if (!endDate) {
      return `${startDay}/${startMonth}/${startYear}`
    } else {
      const endYear = dayjs(endDate).get('y');
      const endMonth = dayjs(endDate).get('M');
      const endDay = dayjs(endDate).get('date');
      return `${startDay}/${startMonth}/${startYear} - ${endDay}/${endMonth}/${endYear}`
    }
  }

  console.log(data);
  return (
    <div className="mx-2">
      {data && data.getTrips.map(trip => {
        return (
          <div className="rounded-lg bg-white max-w-sm m-auto mb-4 mt-3 shadow-lg" key={trip._id} onClick={() => selectTrip(trip)}>
            <div>
              <img className="rounded-t-lg" src={langkawi} />
            </div>
            <div className="p-6 rounded-b-lg">
              <h4 className="text-3xl font-bold pb-2">{trip.tripName}</h4>
              <p className="text-xl pb-1">{`${trip.baseCurrency} ${trip.totalSpent} | ${trip.foreignCurrency}`}</p>
              <p className="text-xl">{setDates(trip.startDate, trip.endDate)}</p>
            </div>
          </div>
        )
      })}
    </div >
  )
}

export default Trips
