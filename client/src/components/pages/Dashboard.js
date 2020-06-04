import React from 'react'
import { useHistory } from 'react-router-dom'

function Dashboard({ user }) {
  const history = useHistory();
  if (!user) {

    history.push('/signin');
  }
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  )
}

export default Dashboard
