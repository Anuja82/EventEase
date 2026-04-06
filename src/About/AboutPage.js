import React from "react";
import "./About.css";
import About from "./About";
import PageHeader from "../PageHeader/PageHeader";


const AboutPage=()=>{
    return(
        <div className="about-page">
           <PageHeader title="About Us" subtitle="Crafting unforgettable event experiences"/>
            <About/>
            
        </div>
    );
};
export default AboutPage;
