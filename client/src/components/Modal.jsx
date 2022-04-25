import React, { useCallback, useContext, useEffect } from "react";
import { ChangedContext } from "../context/ChangedContext";
import { useHttp } from "../hooks/http.hook";
function Modal({order, onclick_handler}) {
    
    const { setChanged, notify_error, notify_success} = useContext(ChangedContext);
    const {request} = useHttp();  

    function stringToBinary(str) {
        let strOut = "";
        for (var i = 0; i < str.length; i++) {
            strOut += str[i].charCodeAt(0).toString(2) + " ";
        }
        return strOut
    }
    const close_handler = useCallback( async () => {
        try{
            const b = stringToBinary(order.ReceiptHandle);
            await request(`/que/${b}`,"PATCH", JSON.stringify({VisibilityTimeout:0}));

        }catch(err){
            console.log(err);
            notify_error(err.message);
            
        }
        onclick_handler();
    }, [notify_error, request, order, onclick_handler]);
    
   
    
    const startProcessing = useCallback( async () =>{
        //if(!isVisible) return;
        try{
            const b = stringToBinary(order.ReceiptHandle);
            await request(`/que/${b}`,"PATCH", JSON.stringify({VisibilityTimeout:600}));
        }catch(err){
            console.log(err);
            notify_error(err.message);            
        }
    }, [request, notify_error, order.ReceiptHandle]);

    useEffect(()=>{
        if(visible){
            startProcessing();
        }        
    }, [visible, startProcessing]);
    const Error = async (e) =>{
        try{
            const b = stringToBinary(order.ReceiptHandle);
            await request(`/que/${b}`,"PATCH", JSON.stringify({VisibilityTimeout:0}));
            notify_success("Error in handling :(");

        }catch(err){
            console.log(err);
            notify_error(err.message);            
        }
        onclick_handler();
        setChanged(true);
        
    }
    const Successful = async (e) =>{
        try{
            const b = stringToBinary(order.ReceiptHandle);
            await request(`/orders/${order._id}`,"PATCH", JSON.stringify({status:"processed"}));
            await request(`/que/${b}`,"DELETE"); 
            notify_success("Successful handling :)");
        }catch(err){
            console.log(err);
            notify_error(err.message);
            
        }
        onclick_handler();
        setChanged(true);
    }
    if(!visible){
        return ;
    }
    
    return (
            <div className="modal-dialog modal-dialog-scrollable my-modal">
                <div className="modal-content my-modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Processing order №{order._id}</h5>
                        <button type="button" className="btn-close" onClick={close_handler}></button>
                    </div>
                    <div className="modal-body my-modal-body">
                    <table className="table table-bordered table-custom position-relative" onClick={order.onclick_handler}>
                        <tbody>
                            <tr>
                                <td className="td-fixed">Name</td>
                                <td>{order.user_name}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{order.user_email}</td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td>{order.address}</td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td>{order.general_price}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td>{order.status}</td>
                            </tr>                                       
                        </tbody>
                    </table>
                    <p className="m-1 fw-bolder">Products</p>
                    <table className="table table-bordered table-custom dropdown-content">
                        <tbody>                
                            <tr>                    
                                <td className="td-fixed">Название</td>
                                <td>Количество</td>
                            </tr>
                            {order.products.map((e, i)=>{
                                return (
                                    <tr key={i}>
                                        <td>{e.name}</td>
                                        <td>{e.amount}</td>
                                    </tr>
                                );
                            })}                                
                        </tbody>
                    </table>
                        
                        <button className="btn btn-danger my-modal-btn" onClick={Error}>Error </button>
                        <button className="btn btn-success" onClick={Successful}>Successful </button>
                        
                    </div>
                    
                </div>
            </div>
    );
}
export default Modal;