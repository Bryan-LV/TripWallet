import React, { useReducer } from 'react'
import { useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'

import { loginSchemaValidation, registerSchemaValidation } from '../../utils/authFormValidation'
import { LOGIN_USER } from '../../queries/user'

const userInputReducer = (state = userAuthState, action) => {
  switch (action.type) {
    case 'login':
    case 'register':
      return ({
        ...state, [action.type]: {
          ...state[action.type],
          [action.input]: action.payload
        }
      })
      break;
    case 'changeForm':
      return { ...state, userActionType: action.payload }
    default:
      return state
      break;
  }
}

const userAuthState = {
  login: {
    email: '',
    password: ''
  },
  register: {
    name: '',
    username: '',
    email: '',
    baseCurrency: '',
    password: '',
    confirmPassword: ''
  },
  error: null,
  userActionType: 'login'
}

function Auth({ auth, user }) {
  const [authState, authDispatch] = useReducer(userInputReducer, userAuthState);
  const [queryLogin] = useMutation(LOGIN_USER, {
    onCompleted: async (data) => {
      auth.login(data.login);
    },
    onError: (error) => {
      console.log(error.message);
    }
  })
  const history = useHistory()

  if (user !== null) {
    history.push('/');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // validate inputs
      await loginSchemaValidation.validate(authState.login, { abortEarly: false });
      // query user ? set user context & set token : show error
      await queryLogin({ variables: authState.login });
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('validation error');
        error.errors.map(err => console.log(err));
      } else {
        console.log(error.message);
      }
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // validate inputs
      await registerSchemaValidation.validate(authState.register, { abortEarly: false });
      // query user
      // if no errors, show user dashboard
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('validation error');
        error.errors.map(err => console.log(err));
      } else {
        console.log(error);
      }
      // query user
      // if no errors, show user dashboard
    }
  }

  const changeForm = (formType) => authDispatch({ type: 'changeForm', payload: formType })

  const Login = (
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="email" value={authState.login.email} onChange={(e) => authDispatch({ type: 'login', input: 'email', payload: e.target.value })} />
      <input type="text" placeholder="password" value={authState.login.password} onChange={(e) => authDispatch({ type: 'login', input: 'password', payload: e.target.value })} />
      <p onClick={(e) => changeForm('register')}>Create an account</p>
      <button type="submit">Login</button>
    </form>
  )

  const Register = (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="name" value={authState.register.name} onChange={(e) => authDispatch({ type: 'register', input: 'name', payload: e.target.value })} />
      <input type="text" placeholder="username" value={authState.register.username} onChange={(e) => authDispatch({ type: 'register', input: 'username', payload: e.target.value })} />
      <input type="text" placeholder="email" value={authState.register.email} onChange={(e) => authDispatch({ type: 'register', input: 'email', payload: e.target.value })} />
      <input type="text" placeholder="base currency" value={authState.register.baseCurrency} onChange={(e) => authDispatch({ type: 'register', input: 'baseCurrency', payload: e.target.value })} />
      <input type="text" placeholder="password" value={authState.register.password} onChange={(e) => authDispatch({ type: 'register', input: 'password', payload: e.target.value })} />
      <input type="text" placeholder="confirm password" value={authState.register.confirmPassword} onChange={(e) => authDispatch({ type: 'register', input: 'confirmPassword', payload: e.target.value })} />
      <p onClick={(e) => changeForm('login')}>Login to your account</p>
      <button type="submit">Register</button>
    </form>
  )

  return (
    <div>
      {authState.userActionType === 'login' ? Login : Register}
    </div>
  )
}

export default Auth