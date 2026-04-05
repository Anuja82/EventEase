import React, { useEffect,useState } from 'react';
import "./Testimonials.css";



const Testimonials=()=>{
    useEffect(()=>{
        const testimonials=document.querySelectorAll(".testimonial");
        let index=0;
        function showNextTestimonials(){
            testimonials[index].classList.remove("active");
            index=(index+1)%testimonials.length;
            testimonials[index].classList.add("active");
        }
        const interval=setInterval(showNextTestimonials,4000);
        return()=>clearInterval(interval);
    },[]);
    
        return(
            <section class="testimonials">
            
                <h2 class="section-title">What People Say
                    
                </h2>
                <div class="testimonial-container">
                    <div class='testimonial active'>
                    
                    <p class='quote'>"EventEase made it so easy to discover and book amazing events. The experience was seamless!"</p>
                   <div class="profile">
                   <img src="images/user1.jpeg" alt="User 1"></img>
                   <div>
                    <h4>Arjun Menon</h4>
                    <p>Client</p>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                   </div>
                   </div>
                    </div>
                    
                    <div class="testimonial">
                        <p class="quote">"As a team lead, I loved how professional and responsive the 
                            EventEase support team was!"</p>
                            <div class="profile">

                                <img src="images/user2.jpeg" alt='User 2'></img>
                                <div>
                                    <h4>Divya Raj</h4>
                                    <p>Senior Developer</p>
                                    <div class="stars">⭐⭐⭐⭐⭐</div>
                                </div>
                            </div>
                    </div>
                    <div class="testimonial">
                        <p class="quote">"We hosted our event through EventEase - it was organized perfectly and reached thousands!"</p>
                            <div class="profile">

                                <img src="images/user3.jpeg" alt='User 3'></img>
                                <div>
                                    <h4>Rahul</h4>
                                    <p>Event organizer</p>
                                    <div class="stars">⭐⭐⭐⭐⭐</div>
                                </div>
                            </div>
                    </div>
                    </div>

            </section>
        );
    };

export default Testimonials;
