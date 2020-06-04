import { gql } from '@apollo/client'

const LOGIN_USER = gql`
  mutation LoginUser($email:String!, $password:String!) {
    login(loginUser: {email:$email, password:$password}){
      _id
      username
      token
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

export { LOGIN_USER, CHECK_AUTH_TOKEN }