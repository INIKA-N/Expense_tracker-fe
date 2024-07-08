import React, { useContext, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  const addIncome = async (income) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      getIncomes();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const getIncomes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`);
      if (Array.isArray(response.data)) {
        setIncomes(response.data);
      } else {
        console.error("Expected an array for incomes");
        setIncomes([]);
      }
      console.log(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`);
      getIncomes();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const totalIncome = () => {
    let totalIncome = 0;
    if (Array.isArray(incomes)) {
      incomes.forEach((income) => {
        totalIncome += income.amount;
      });
    }
    return totalIncome;
  };

  const addExpense = async (expense) => {
    try {
      await axios.post(`${BASE_URL}add-expense`, expense);
      getExpenses();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      if (Array.isArray(response.data)) {
        setExpenses(response.data);
      } else {
        console.error("Expected an array for expenses");
        setExpenses([]);
      }
      console.log(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`);
      getExpenses();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const totalExpenses = () => {
    let totalExpenses = 0;
    if (Array.isArray(expenses)) {
      expenses.forEach((expense) => {
        totalExpenses += expense.amount;
      });
    }
    return totalExpenses;
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
