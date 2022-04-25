import React, { useState } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import { toast, ToastContainer } from "react-toastify";
import { ChangedContext } from "./context/ChangedContext";
import ConsummerPage from "./pages/ConsummerPage";
import Loader from "./components/Loader";
import { useHttp } from "./hooks/http.hook";

function App() {
  const [changed, setChanged] = useState(true);
  const {loading} = useHttp();
  const notify_error = (msg) => toast.error(msg);
  const notify_success = (msg) => toast.success(msg);
  

  return (
    <ChangedContext.Provider value={{changed, setChanged, notify_error, notify_success}}>
    <div className="App">
    <Router>
      <Header/>
      <ToastContainer/>
      {loading? <Loader/> : 
      <Routes>
        <Route path="/"  
          element={<MainPage/>}>
        </Route>
        <Route path="/consummer"  
          element={<ConsummerPage/>}>
        </Route>
      </Routes>}
      
      <Footer/>
    </Router>
    </div>
    </ChangedContext.Provider>
    
  );
}

export default App;
