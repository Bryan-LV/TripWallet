import React, { useContext, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import { Auth, Dashboard, Trip } from './components/pages'
import { AuthContext } from './context/auth/AuthContext'
import { CHECK_AUTH_TOKEN } from './queries/user'
import checkToken from './utils/checkToken'
import './styles/App.css'

function App() {
  const { auth, user } = useContext(AuthContext);
  const [queryToken] = useLazyQuery(CHECK_AUTH_TOKEN, {
    onCompleted: () => {
      auth.persistUser();
    },
    onError: () => {
      // TODO: handle error
    }
  });

  useEffect(() => {
    const persistUser = async () => {
      if (user === null) {
        // check is not expired
        const isValid = await checkToken()
        // not expired ? check token is valid : logout
        isValid ? queryToken() : auth.logout();
      }
    }
    persistUser()
  }, [])

  return (
    <div className="App">
      <h2>Trip Wallet</h2>
      <Switch>
        <Route exact path="/">
          <Dashboard user={user} />
        </Route>
        <Route exact path="/signin">
          <Auth auth={auth} user={user} />
        </Route>
        <Route exact path="/trip">
          <Trip />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
