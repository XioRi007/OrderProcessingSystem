import React, { useState } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css';
import Loader from "./components/Loader";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import { useHttp } from "./hooks/http.hook";
import { ToastContainer } from "react-toastify";
import { ChangedContext } from "./context/ChangedContext";
String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
function App() {
  const [changed, setChanged] = useState(true);

  return (
    <ChangedContext.Provider value={{changed, setChanged}}>
    <div className="App">
    <Router>
      <Header/>
      <ToastContainer/>
      <Routes>
        <Route path="/"  
          element={<MainPage/>}>
        </Route>
      </Routes>
      <Footer/>
    </Router>
    </div>
    </ChangedContext.Provider>
    
  );
}

export default App;
