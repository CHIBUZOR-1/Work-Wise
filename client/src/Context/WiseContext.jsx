import axios from 'axios';
import React from 'react'
import { createContext } from 'react'

const WorkContext = createContext();
const WorkContextProvider = ({children}) => {
    axios.defaults.withCredentials = true;
    return (
      <WorkContext.Provider value={{}}>
        {children}
      </WorkContext.Provider>
    )
}

const useAuth = () => useContext(WorkContext);
export { useAuth, WorkContextProvider  };