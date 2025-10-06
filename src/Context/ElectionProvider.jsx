// src/Context/ElectionContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../APIs/apiService';
import { useApiPromise } from '../Hooks/useApi';

const ElectionContext = createContext();



export const ElectionProvider = ({ children }) => {
  const { run, loading, error } = useApiPromise();
  const [electionList, setElectionList] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const result = await run(() =>
          api.get('/vote/getallvote', { token: false })
        );
        setElectionList(result);
      } catch (err) {
        console.error('API error:', err);
      }
    };
    fetchElections();
  }, []);

  return (
    <ElectionContext.Provider
      value={{
        electionList,
        setElectionList,
        loading,
        error,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

// custom hook for easy access
export const useElection = () => useContext(ElectionContext);
