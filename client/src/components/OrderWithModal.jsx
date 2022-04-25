import React, { useContext } from "react";
import Dropdown from "./Dropdown";
import { useModal } from "react-modal-hook";
import { ChangedContext } from "../context/ChangedContext";
import { useHttp } from "../hooks/http.hook";
function stringToBinary(str) {
    let strOut = "";
    for (var i = 0; i < str.length; i++) {
        strOut += str[i].charCodeAt(0).toString(2) + " ";
    }
    return strOut
}
function OrderWithModal(order) {
    const { setChanged, notify_error, notify_success} = useContext(ChangedContext);
    const {request} = useHttp();  
    const Error = async (e) =>{
        try{
            const b = stringToBinary(order.ReceiptHandle);
            await request(`/que/${b}`,"PATCH", JSON.stringify({VisibilityTimeout:0}));
            notify_success("Error in handling :(");

        }catch(err){
            console.log(err);
            notify_error(err.message);            
        }
        hideModal();
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
        hideModal();
        setChanged(true);
    }
    const show_handler = async()=>{
        showModal();
        try{
            const b = stringToBinary(order.ReceiptHandle);
            await request(`/que/${b}`,"PATCH", JSON.stringify({VisibilityTimeout:600}));
        }catch(err){
            console.log(err);
            notify_error(err.message);            
        }
    }
    const hide_handler = async ()=>{
        try{
            const b = stringToBinary(order.ReceiptHandle);
            await request(`/que/${b}`,"PATCH", JSON.stringify({VisibilityTimeout:0}));
        }catch(err){
            console.log(err);
            notify_error(err.message);            
        }
        hideModal();
    }
    const [showModal, hideModal] = useModal(()=>{        
        return (
                <div className="modal-dialog modal-dialog-scrollable my-modal">
                    <div className="modal-content my-modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Processing order №{order._id}</h5>
                            <button type="button" className="btn-close" onClick={hide_handler}></button>
                        </div>
                        <div className="modal-body my-modal-body">
                        <table className="table table-bordered table-custom position-relative" >
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
                            <button className="btn btn-success" onClick={Successful}>Successful</button>
                            
                        </div>
                        
                    </div>
                </div>
        );
    });
    
    return (
        <div className="card col-4 card-custom position-relative" style={{width: "18rem"}} >
            <div className="card-header" onClick={show_handler}>
                Order №{order._id}
            </div>
            <table className="table table-bordered table-custom" onClick={show_handler}>
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
            <Dropdown products={order.products}/>
            
            
        </div>
    );
}
export default OrderWithModal;
