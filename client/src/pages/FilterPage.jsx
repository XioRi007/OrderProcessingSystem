import React, { useEffect, useState } from "react";


import Loader from "../components/Loader";
import Order from "../components/Order";
import {  toast } from 'react-toastify';

import { useHttp } from "../hooks/http.hook";


function FilterPage() {
  const [list, setList] = useState([]);
  
  const [changed, setChanged] = useState(false);
  
  
  const notify_error = (msg) => toast.error(msg);

  const {request, loading} = useHttp();  

  
  useEffect(()=>{
    async function fetchData(){
      try{
        if(!list.length || changed){
          const response = await request("http://localhost:5000/orders");
          setList(response);
          setChanged(false);
        }
      }
      catch(err){
        notify_error(err.message);
      }      
    };
    fetchData();
    }
  )


  return (
    <div className="App">
        <div className="input-group">
        <label class="input-group-text" for="inputGroupSelect04">Options</label>
  <select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <button className="btn btn-outline-secondary" type="button">Button</button>
</div>      
      <main className="main">
      {loading ? <Loader/> : 
          <div className="container">
          <div className="row">
          {list.length===0 ? <p>No orders</p>:
          list.map((e,i)=>{
            return <Order {...e} key={i}/>
          })
          }
          </div>
        </div>
        }     
      </main>      
    </div>
  );
}

export default FilterPage;
