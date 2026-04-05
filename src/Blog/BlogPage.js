import React from "react";
import "./Blog.css";
import Blog from "./Blog";
import PageHeader from "../PageHeader/PageHeader";






const BlogPage=()=>{
   return(
        <div className="Blog-page">
           <PageHeader 
          title="Event Insights & Inspiration"
          subtitle="Discover trending events, planning tips, and ideas to make your next experience unforgettable."/>
             <Blog/>
            
         </div>
    );
 };
export default BlogPage;
