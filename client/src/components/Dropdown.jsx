import { useState } from "react";
function Dropdown({ products }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="dropdown">
      

      <table className="table table-bordered table-custom position-relative ">
            <tbody>
                     <tr className="table-active">
                        <td colSpan="2" onClick={(e) => setIsActive(!isActive)}>Products</td>
                    </tr> 
            </tbody>
        </table>


      {isActive && (
        <table className="table table-bordered table-custom dropdown-content">
            <tbody>
                
                <tr>                    
                    <td>Название</td>
                    <td>Количество</td>
                </tr>
                {products.map((e, i)=>{
                    return (
                        <tr key={i}>
                            <td>{e.name}</td>
                            <td>{e.amount}</td>
                        </tr>
                    );
                })}
                                
            </tbody>
        </table>
      )}
    </div>
  );
}

export default Dropdown;