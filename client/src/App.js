import React, { useContext, useEffect, useState } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import { Auth, Dashboard, Trip } from './components/pages'
import TripForm from './components/forms/TripForm'
import { AuthContext } from './context/auth/AuthContext'
import { CHECK_AUTH_TOKEN } from './queries/user'
import checkToken from './utils/checkToken'
import './styles/App.css'

function App() {
  const { auth, user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [editForm, setEditForm] = useState({ isEdit: false, }); // is trip form creating new trip or editing trip
  const [queryToken] = useLazyQuery(CHECK_AUTH_TOKEN, {
    onCompleted: () => {
      auth.persistUser();
    },
    onError: (error) => {
      // TODO: handle error
      console.log(error);
    }
  });

  useEffect(() => {
    const persistUser = async () => {
      if (user === null) {
        // check is not expired, if not validate token on server
        const isValid = await checkToken()
        if (isValid) {
          queryToken()
        }
      }
    }
    persistUser()
  }, [])

  return (
    <div className="App">
      <Link to="/"><h2>Trip Wallet</h2></Link>
      <Switch>
        <Route exact path="/">
          <Dashboard user={user} auth={auth} setTrip={setTrip} setEditForm={setEditForm} />
        </Route>
        <Route exact path="/tripform">
          <TripForm user={user} editForm={editForm} />
        </Route>
        <Route exact path="/signin">
          <Auth auth={auth} user={user} />
        </Route>
        <Route path="/trip">
          <Trip trip={trip} setEditForm={setEditForm} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
