import React, { useContext, useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import { Auth, Dashboard, Trip, ExpenseItem } from './components/pages'
import { TripForm, ExpenseForm } from './components/forms'
import { AuthContext } from './context/auth/AuthContext'
import { CHECK_AUTH_TOKEN } from './queries/user'
import checkToken from './utils/checkToken'
import Navbar from './components/Navbar'

function App() {
  const { auth, user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null); // select trip when user clicks on trip box
  const [isTripEdit, setTripEdit] = useState({ isEdit: false, }); // is trip form creating a new trip or editing trip
  const [expenseData, setExpenseData] = useState(null); // edit an expense
  const [expenseItem, setExpenseItem] = useState(null) // expense info for showing single expense
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
  }, [user])

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <Dashboard user={user} auth={auth} setTrip={setTrip} setTripEdit={setTripEdit} />} />
        <Route exact path="/trip" render={() => <Trip trip={trip} setTripEdit={setTripEdit} setExpenseData={setExpenseData} setExpenseItem={setExpenseItem} />} />
        <Route exact path="/trip/expense" render={() => <ExpenseItem data={expenseItem} setExpenseData={setExpenseData} />} />
        <Route exact path="/trip/expenseform" render={() => <ExpenseForm expenseData={expenseData} />} />
        <Route exact path="/tripform" render={() => <TripForm user={user} isTripEdit={isTripEdit} />} />
        <Route exact path="/login" render={() => <Auth auth={auth} user={user} />} />
        <Route exact path="/register" render={() => <Auth auth={auth} user={user} />} />
      </Switch>
    </div >
  );
}

export default App;
