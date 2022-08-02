import React, {useState, useEffect, useCallback} from "react";

let logoutTimmer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
})

const calculaytRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime()
  const adjExpirationTime = new Date(expirationTime).getTime()
  const remainingDuration = adjExpirationTime - currentTime
  return remainingDuration
}

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token')
  const storedExpirationDate = localStorage.getItem('tokenExpiration')  
  const remainingTime = calculaytRemainingTime(storedExpirationDate)
  if(remainingTime <= 3600){
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiration')
    return null
  }
  return {
    token: storedToken,
    duration: remainingTime
  }
}

export const AuthContextProvider = ({ children }) => {
  const tokenData = retrieveStoredToken()

  const initialToken = tokenData?.token ? tokenData?.token : null
  const [token, setToken] = useState(initialToken)
  const userIsLogged = !!token
  
  const logoutHandler = useCallback(() => {
    console.log('logoutHandler')
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')
    if(logoutTimmer){
      clearTimeout(logoutTimmer)
    }
  }, [])

  const loginHandler = (token, expirationTime) => {
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('expirationTime', expirationTime)
    const remainingTime = calculaytRemainingTime(expirationTime)
    logoutTimmer = setTimeout(logoutHandler, remainingTime);
  }

  useEffect(() => {
    if(tokenData){
      logoutTimmer = setTimeout(logoutHandler, tokenData.duration);
    }
  },[logoutHandler, tokenData])

  const  contextValue = {
    token : token,
    isLoggedIn: userIsLogged,
    login: loginHandler,
    logout: logoutHandler
  }
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthContext