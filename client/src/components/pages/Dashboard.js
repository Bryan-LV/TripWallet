import React, { useEffect } from 'react'
import { useHistory, Route, Link } from 'react-router-dom'
import Trips from '../containers/Trips';

function Dashboard({ user, setTrip, auth, setEditForm }) {
  const history = useHistory();
  useEffect(() => {
    if (!user) {
      history.push('/signin');
    }
  }, [user])

  return (
    <div>
      <h4>Dashboard</h4>
      <Trips setTrip={setTrip} />
      <Link to="/tripform" onClick={() => setEditForm({ isEdit: false, formDetails: null })}>Add trip</Link>
      <button onClick={auth.logout}>Logout</button>
    </div>
  )
}

export default Dashboard
