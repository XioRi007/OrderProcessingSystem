import React from "react";
import Dropdown from "./Dropdown";
function Order(order) {
    
    return (
        <div className="card col-4 card-custom position-relative" style={{width: "18rem"}} >
            <div className="card-header" onClick={order.onclick_handler}>
                Order №{order._id}
            </div>
            <table className="table table-bordered table-custom" onClick={order.onclick_handler}>
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
export default Order;
