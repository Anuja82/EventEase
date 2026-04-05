import React from "react";
import "./PopularEvents";
import PopularEvents from "./PopularEvents";
import PageHeader from "../PageHeader/PageHeader";



const PopularPage=()=>{
    return(
        <div className="popular-page">
           <PageHeader title="Our Events" subtitle="Find and book your perfect event"/>
            <PopularEvents/>
            
        </div>
    );
};
export default PopularPage;
