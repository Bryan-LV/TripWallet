import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useHistory, Link, Route } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { loginSchemaValidation, registerSchemaValidation } from '../../utils/authFormValidation'
import { LOGIN_USER, REGISTER_USER } from '../../queries/user'
import currencyCodes from '../../utils/currencyCodes'

const Login = ({ auth, url }) => {
  const [queryLogin] = useMutation(LOGIN_USER, {
    onCompleted: async (data) => {
      auth.login(data.login);
    },
    onError: (error) => {
      // TODO: Handle Error ( alert context maybe?)
      console.log(error.message);
      console.log(error);
    }
  })

  const handleLogin = async (values) => {
    try {
      // query user ? set user context & set token : show error
      await queryLogin({ variables: values });
    } catch (error) {
      // FIXME: Handle Error ( alert context maybe?)
      if (error.name === 'ValidationError') {
        console.log('validation error');
        error.errors.map(err => console.log(err));
      } else {
        console.log(error.message);
      }
    }
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchemaValidation}
      onSubmit={handleLogin}
    >
      <Form>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" placeholder="email" name="email" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="email">{(errorMsg) => <p className="mx-10">{errorMsg}</p>}</ErrorMessage>

        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" placeholder="password" name="password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <ErrorMessage name="password">{(errorMsg) => <p className="mx-10">{errorMsg}</p>}</ErrorMessage>

        <Link to="/register" className="inline-block mx-10 my-5 p-4 bg-green-400">Create an account</Link>
        <div className="text-center mt-4">
          <button type="submit" className="py-3 px-6 text-lg font-medium bg-teal-400 w-3/4 md:w-1/2">Login</button>
        </div>
      </Form>
    </Formik>
  )
}

const Register = ({ auth }) => {
  const [queryRegister] = useMutation(REGISTER_USER, {
    onCompleted: async (data) => {
      auth.login(data.register);
    },
    onError: (error) => {
      // TODO: Handle Error ( alert context maybe?)
      console.log(error.message);
    }
  })

  const handleRegister = async (values) => {

    try {
      // query user ? set user context & set token : show error
      await queryRegister({ variables: values });
    } catch (error) {
      // FIXME: Handle Error ( alert context maybe?)
      if (error.name === 'ValidationError') {
        console.log('validation error');
        error.errors.map(err => console.log(err));
      } else {
        console.log(error);
      }
    }
  }

  return (
    <Formik
      initialValues={{
        name: '',
        username: '',
        email: '',
        baseCurrency: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={registerSchemaValidation}
      onSubmit={handleRegister}>

      <Form onSubmit={handleRegister}>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="name" placeholder="Name" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="username" placeholder="Username" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="email" placeholder="email" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="photo" placeholder="Photo" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10 mb-8">
          <Field name="baseCurrency" as="select" placeholder="Select Currency" placeholder="base currency" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none">
            {currencyCodes.map(currencyCode => <option key={currencyCode} value={currencyCode}>{currencyCode}</option>)}
          </Field>
        </div>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="password" placeholder="password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>
        <div className="flex items-center border-b border-b-2 border-gray-900 py-2 mx-10">
          <Field type="text" name="confirmPassword" placeholder="confirmPassword" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
        </div>

        <Link to="/login" className="inline-block mx-10 my-5 p-4 bg-green-400"> Login to your account</Link>
        <div className="text-center mt-4">
          <button type="submit" className="py-3 px-6 text-lg font-medium bg-teal-400 w-3/4 md:w-1/2">Register</button>
        </div>
      </Form >
    </Formik>
  )
}

function Auth({ auth, user }) {
  const history = useHistory()
  useEffect(() => {
    if (user !== null) {
      history.push('/');
    }

  }, [user])

  return (
    <div>
      <Route exact path="/login">
        <Login auth={auth} />
      </Route>
      <Route path="/register">
        <Register auth={auth} />
      </Route>
    </div>
  )
}

export default Auth