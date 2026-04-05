import React from 'react'
import './HeroSection.css';
import { motion } from 'framer-motion';
import { useState,useEffect } from 'react';
import { Link } from "react-router-dom";

const HeroSection=()=>{
  const slogans=[
    "Discover, Book, and Enjoy Event Seamlessly",
    "Your Gateway to Concerts,Conferences & More",
    "Find and Host Memorable Events with Ease"
  ];
  const [currentIndex, setCurrentIndex]=useState(0);
  useEffect(()=>{
    const interval=setInterval(()=>{
      setCurrentIndex((prev)=>(prev+1)%slogans.length);},4000);
      return ()=>clearInterval(interval);

    },[slogans.length])
  
    
  return (
    <section className='hero'aria-label='Event booking and hosting hero section'>
    <motion.div className='hero-content' initial={{ opacity:0,y:40 }}
    animate={{ opacity:1,y:0}}
    transition={{duration:1.2,ease:'easeOut'}}>
    <motion.h1 key={currentIndex} initial={{ opacity:0,y:20 }}
    animate={{ opacity:1,y:0 }}
    exit={{opacity:0,y:-20}}
    transition={{duration:0.8}}>{slogans[currentIndex]}</motion.h1>
     <p>From concerts to conferences - find and book your perfect event.</p>
      <div className='hero-buttons'>
        <Link to="/event">
                <button className='btn-primary'>Explore Events</button></Link>
        <Link to="/host-event"><button className='btn-secondary'>Host an Event</button></Link>
            </div>
    </motion.div>
       
           
       
    </section>
    
  );
};

export default HeroSection
