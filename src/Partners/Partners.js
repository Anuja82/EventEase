import React from 'react';
import  './Partners.css';
import { FaTicketAlt } from "react-icons/fa";
import {  MdLock } from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";


const Partners=()=> {
  return (

    
  <section class="why-choose">
    <h2>Why Choose <span class="brand">EventEase</span></h2>
    <p class="subtitle">Streamlined, secure, and exciting 
      event experiences at your fingertips.</p>
      <div class="features">
     
         <div class="card">
          <FaTicketAlt className='icon ticket'/>
          <h3>Easy Booking</h3>
          <p>Seamless and quick booking experience with just a few clicks</p>
        </div>
         <div class="card">
          <MdLock className='icon security'/>
          <h3>Secure Payments</h3>
          <p>Safe and reliable payment processing with industry-standard security.</p>
        </div>
        <div class="card">
          <GiPartyPopper  className='icon discovery'/>
          <h3>Event Discovery</h3>
          <p>Find concerts, workshops, conferences, and experiences near you.</p>
        </div>
      </div>
  </section>
);
}


export default Partners;
