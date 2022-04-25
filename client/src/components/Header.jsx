import React, {  useContext, useState } from "react";
import {  toast } from 'react-toastify';
import { useHttp } from "../hooks/http.hook";
import { ChangedContext } from "../context/ChangedContext";
const { faker } = require('@faker-js/faker');
function Header() {
    const [count, setCount] = useState(1);  
    const { setChanged} = useContext(ChangedContext);      
    const {request} = useHttp(); 
    const notify = (msg) => toast.success(msg);
    const notify_error = (msg) => toast.error(msg);
    const count_handler = (e)=>{
        setCount(e.target.value);
      }
      const generate_handler = async ()=>{
        try{
          if(!count || count < 1){
            notify_error("Enter the number >= 1");
            return;
          }
          for(let i = 0; i < count; i++){
            const order = {
              address: faker.address.country() +", "+ faker.address.city() + ", "+ faker.address.streetName()+" Street",
              user_email: faker.internet.email(),
              user_name: faker.name.firstName()+" "+faker.name.lastName(),
              status: "created"
            };
            order.products = [];
            const n = Math.floor(Math.random() * 10) + 1;
            for(let i = 0; i < n; i++){
              const product = faker.commerce.product();
              if(order.products.filter((e=>
                e.name===product
              )).length === 0){
                order.products.push({
                  name: product,
                  amount: Math.floor(Math.random() * 10) + 1
                });
              }        
            }
            await request(`/orders`, "POST", JSON.stringify({...order, general_price:parseFloat(faker.finance.amount())})); 
          }
          
          notify("Generation successful");
          setCount(1);
          setChanged(true);
    
        }catch(err){
          notify_error(err.message);
        }
        
       
      }
  return (
    <header className="navbar navbar-light navbar-green">
          <div className="container">
            <div className="nav-links">
              <a className="navbar-brand navbar-brand-light" href="/">Stock</a> 
              <a className="navbar-link my-link" href="/consummer">Consummer</a> 
            </div>
            
                         
            <div className="nav-item">
              <input type="number" min="1" className="numericUpDown" onChange={count_handler} value={count}/>
              <button className="btn btn-light" onClick={generate_handler}>Generate</button>
            </div>            
          </div>
      </header>
  );
}

export default Header;