import React from 'react'
import './About.css';


const About=()=>{
 return (
    <section className='about'data-aos="fade-up">
        <div className='about-content'>
            <div className='about-text'>
            <h2>About EventEase</h2>
            <p>EventEase is your all-in-one platform to discover, plan, and manage events effortlessly.
                    From concerts to corporate meetups, we simplify the entire event experience - for both
                        attendees and hosts.<br></br>
                     Our goal is to bring innovation and connection together through technology and design.
            </p>
        </div>
        <div className='about-image' data-aos="zoom-in">
            <img src='/images/about-banner.jpeg' alt="EventEase Overview"/>
        </div>
        </div>

    </section>
    
      
    
  );
};

export default About
