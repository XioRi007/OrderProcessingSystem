import React, { useContext, useEffect, useState } from "react";


import Loader from "../components/Loader";
import Order from "../components/Order";

import { useHttp } from "../hooks/http.hook";
import { ChangedContext } from "../context/ChangedContext";
import Modal from "../components/Modal";


function ConsummerPage() {
  const [list, setList] = useState([]);  
  const {request, loading} = useHttp();  
  const {changed, setChanged, notify_error} = useContext(ChangedContext);
  const [showModal, setModal] = useState(false);
  const handleOpenModal = () => {
    setModal(true);
  }  
  const handleCloseModal = () => {
    setModal(false);
  }   
  useEffect(()=>{
    async function fetchData(){
      try{
        if(changed){
          const response = await request(`/que`);
          if(!response) return;
            setList(response);
        }
      }
      catch(err){
          console.log(err);
          notify_error(err.message);
      } 
      setChanged(false);       
    };
    fetchData();
    }, [changed, notify_error, request, setChanged]
  )
  
  return (
    <React.Fragment>
        
        <main className="main">
        {loading ? <Loader/> : 
              <div className="container">
                  <div className="row">
                  {list.length===0 ? <p>No orders</p>:
                  list.map((e,i)=>{
                    return <React.Fragment key={i}>
                              <Order key={e._id} {...e} onclick_handler={handleOpenModal}/>                                
                              <Modal key={i/1000} order={e} onclick_handler={handleCloseModal} visible={showModal}/>                              
                           </React.Fragment>
                })
                  }
                  </div>
              </div>
          }
           
        </main>   

      </React.Fragment>
  );
}

export default ConsummerPage;

   /* */