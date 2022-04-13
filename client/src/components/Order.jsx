import React, { useContext } from "react";
import { ChangedContext } from "../context/ChangedContext";
import { useHttp } from "../hooks/http.hook";
import Dropdown from "./Dropdown";
import { toast } from 'react-toastify';
function Order(order) {
    const {setChanged} = useContext(ChangedContext);
    const {request} = useHttp();
    
    const notify = (msg) => toast.success(msg);
    const notify_error = (msg) => toast.error(msg);
    const toggle_status_handler = async()=>{
        let status="";
        if(order.status === "added"){
            status = "processed";
        }
        else{
            status = "added";
        }
        try{
            await request(`/orders/${order._id}`, "PATCH", JSON.stringify({"status":status}));
            setChanged(true);
            notify("Edit successful");

        }catch(err){
            notify_error(err.message);
        }

    }
    return (
        <div className="card col-4 card-custom" style={{width: "18rem"}}>
            <div className="card-header">
                Order №{order._id}
            </div>
            <table className="table table-bordered table-custom">
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
                        <td><div className="position-relative">
                        {order.status}
                        <button className="btn btn-edit" onClick={toggle_status_handler}>
                            <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="20px" height="20px"><path d="M22 51c-1-1-4-1-4-1l-.425-1.274c-.362-1.086-1.215-1.939-2.301-2.301L14 46c0 0 .5-2.5-1-4l25-25 8 10L22 51zM52 21l-9-9 4.68-4.68c0 0 3.5-1.5 7 2s2 7 2 7L52 21zM9 50l-1.843 4.476c-.614 1.49.877 2.981 2.367 2.367L14 55 9 50z"/></svg>
                        </button>
                        
                        </div></td>
                    </tr>
                                       
                </tbody>
            </table>
            <Dropdown products={order.products}/>
            
            
        </div>
    );
}
export default Order;
/*<table className="table table-bordered table-custom">
                <tbody>
                    <tr>
                        <td>Название</td>
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
            </table>*/