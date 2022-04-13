import React, { useContext, useEffect, useState } from "react";


import Loader from "../components/Loader";
import Order from "../components/Order";
import { toast } from 'react-toastify';

import { useHttp } from "../hooks/http.hook";
import { ChangedContext } from "../context/ChangedContext";

String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
function MainPage() {
  const [list, setList] = useState([]);
  const notify_error = (msg) => toast.error(msg);
  const {request, loading} = useHttp();  
  const [filter, setFilter] = useState("");
  const {changed, setChanged} = useContext(ChangedContext);

  
  useEffect(()=>{
    async function fetchData(){
      try{
        if(changed){
            console.log("here");
          const response = await request(`/orders`);
            setList(response);
            setChanged(false);                
        }
      }
      catch(err){
        notify_error(err.message);
      }      
    };
    fetchData();
    }, [changed]
  )
  const filter_onchange_handler = (e)=>{
      setFilter(e.target.value);
  }
  const filter_handler = async(e)=>{
      e.preventDefault();
      try{
          let res = [];
          if(filter !== ""){
            res = await request(`/orders?filter=%7B%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22status%22%3A%20%22${filter}%22%0A%20%20%7D%0A%7D`);
          }else{
            res = await request(`/orders`);
          }          
        setList(res);

      }catch(err){
          notify_error(err);
      }
  }

  return (
    <React.Fragment>
        <div className="input-group filter-group">
            <label className="input-group-text filter-label" htmlFor="inputGroupSelect04">Status</label>
            <select className="form-select select-custom" id="inputGroupSelect04" aria-label="..." value={filter} onChange={filter_onchange_handler}>
                <option value="">All</option>
                <option value="added">Added</option>
                <option value="processed">Processed</option>
            </select>
            <button className="btn filter-btn" type="button" onClick={filter_handler}>Filter</button>
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

      </React.Fragment>
  );
}

export default MainPage;
