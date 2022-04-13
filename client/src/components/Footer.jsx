import React from "react";
import { Link } from "react-router-dom";
const Footer = ()=>{ 
    return (
        <footer className="bg-light text-center text-lg-start mx-auto mt-4">  
  <div className="container p-4">   
    <div className="row justify-content-between">
     
      <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
        <h5 className="text-uppercase">--не-придумано--</h5>
        <p>
          Система обробки замовлень, створена в рамках курсової роботи з дисципліни "Практикум з програмування"
        </p>
        <ul className="list-unstyled mb-0 ">
            <li>
             <Link className="link-secondary text-decoration-none " to="/">Головна</Link>
          </li>          
         
        </ul>
      </div>    
    
      <div className="col-lg-3 col-md-6 mb-4 mb-md-0 text-end">
        <h5 className="text-uppercase ">Credits</h5>

        <ul className="list-unstyled mb-0 ">
          <li>
            <p>Виконала: студентка 3 курсу математичного фак-ту гр. 6.1219-1пі Барнаш Марія</p>
          </li>
          <li>
            <p>Науковий керівник: к.ф.-м.н., доцент Лісняк А.О. </p>
          </li>
         
        </ul>
      </div>     
    
    </div>
    
  </div>


 
  <div className="text-center p-3 footer-bot">
    © 2022 Copyright:
    <a className="link-primary text-decoration-none" href="https://github.com/XioRi007" target="_blank" rel="noreferrer">&nbsp;Mariia Barnash</a>
  </div>
 
</footer>
    )
}
export default Footer;