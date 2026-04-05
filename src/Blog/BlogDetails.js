import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import "./BlogDetails.css";

function BlogDetails() {

  const location = useLocation();
  const navigate = useNavigate();

  const blog = location.state;

  if (!blog) {
    return (
      <div className="blog-details-page">
        <h2 className="blog-error">Blog not found</h2>
      </div>
    );
  }

  return (

    <div className="blog-details-page">

      <PageHeader
        title={blog.title}
        subtitle="Insights, stories, and ideas that inspire"
      />

      <div className="blog-details-container">
        

        <img
          src={blog.image}
          alt={blog.title}
          className="blog-details-image"
        />

        <span className="blog-details-date">
          {blog.date}
        </span>

        

        <div className="blog-details-content">
          {blog.content}
        </div>

        <button
          className="back-btn"
          onClick={() => navigate('/blog')}
        >
          ← Back to Blogs
        </button>

      </div>

    </div>
  );
}

export default BlogDetails;

