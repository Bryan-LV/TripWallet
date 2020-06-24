import React, { useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import Trips from '../containers/Trips';

function Dashboard({ user, setTrip, auth, setTripEdit }) {
  const history = useHistory();
  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
  }, [user])

  return (
    <div className="bg-gray">
      <Trips setTrip={setTrip} />
      <Link to="/tripform" onClick={() => setTripEdit({ isEdit: false, formDetails: null })} className="inline-block mx-10 my-5 p-4 bg-green-400">Add trip</Link>
      <button onClick={auth.logout} className="inline-block mx-10 my-5 p-4 bg-red-400">Logout</button>
    </div>
  )
}

export default Dashboard
