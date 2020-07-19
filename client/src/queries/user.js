import { gql } from '@apollo/client'

const LOGIN_USER = gql`
  mutation LoginUser($email:String!, $password:String!) {
    login(loginUser: {email:$email, password:$password}){
      _id
      username
      token
      baseCurrency
    }
  }
`

const REGISTER_USER = gql`
  mutation RegisterUser($name:String!, $username:String!, $email: String!, $baseCurrency: String!, $password: String!, $confirmPassword: String!){
    register(registerUser: {name: $name, username: $username, email:$email, baseCurrency:$baseCurrency, password:$password , confirmPassword:$confirmPassword}){
      _id
      username
      token
      baseCurrency
      trips
    }
  }
`

const CHECK_AUTH_TOKEN = gql`
  {
    checkAuth{
      isValid
    }
  }
`

const FETCH_USER = gql`
  query FetchUser ($id: ID!){
   user(id: $id) { 
		_id
    username
    name
    email
    baseCurrency
    createdAt
  }
}

`

export { LOGIN_USER, CHECK_AUTH_TOKEN, REGISTER_USER, FETCH_USER }