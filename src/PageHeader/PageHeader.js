import React from 'react'
import './PageHeader.css';
const PageHeader=({title,subtitle})=> {
  return (
    <section className='page-header fade-in' >
        <div className='overlay'>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
           
        </div>
    </section>
   
  );
};

export default PageHeader;
