

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

export default function Blog() {

  const navigate = useNavigate();

  const posts = [

    {
      id: 1,
      title: "Top 5 Event Trends for 2025",
      desc: "AI-powered planning, immersive LED visuals, AR stages, hybrid events and eco-friendly experiences...",
      content:
"Event experiences are evolving faster than ever before, and 2025 is set to redefine how audiences interact with live environments. Artificial Intelligence is now helping organizers personalize attendee journeys through smart recommendations, automated scheduling, and predictive engagement analytics.\n\nImmersive LED walls and projection mapping are transforming traditional stage setups into cinematic storytelling platforms that respond dynamically to music and audience reactions. Augmented Reality (AR) and Virtual Reality (VR) integrations are also becoming increasingly popular, allowing attendees to interact with digital stage elements and explore virtual event spaces.\n\nHybrid events continue to dominate the industry, combining physical and virtual participation to expand audience reach globally. Sustainability is another key trend, with organizers adopting reusable stage materials, digital ticketing, and energy-efficient lighting systems to reduce environmental impact.\n\nTogether, these innovations are shaping a smarter, greener, and more interactive future for the event industry.",
      image: "/images/Blog1.0.jpeg",
      date: "Dec 2025",
    },

    {
      id: 2,
      title: "Exclusive Interview: DJ Arjun Talks About Next-Gen Music",
      desc: "Insights into the evolution of EDM festivals and immersive audience interaction...",
      content:
"In an exclusive conversation with DJ Arjun, we explored how technology is transforming the global electronic music landscape. According to him, modern festivals are no longer just about sound—they are about immersive storytelling experiences that combine visuals, lighting, and audience interaction.\n\nHe emphasized the importance of synchronized LED visuals and AI-powered beat mapping systems that allow lighting and stage graphics to react instantly to music transitions. This creates a powerful connection between performers and audiences.\n\nDJ Arjun also highlighted the rapid growth of hybrid concerts, where fans from around the world can attend virtually through interactive streaming platforms. These platforms allow viewers to choose camera angles, interact with performers, and participate in live chats.\n\nLooking ahead, he believes the future of EDM lies in personalized festival experiences powered by wearable technology and smart event apps that adapt to each attendee’s preferences.",
      image: "/images/Blog2.jpeg",
      date: "Nov 2025",
    },

    {
      id: 3,
      title: "How to Plan a Perfect Live Concert",
      desc: "Venue selection, sound engineering, lighting design and audience engagement strategies explained...",
      content:
"Planning a perfect live concert requires a balance between creative vision and technical execution. The process begins with selecting the right venue based on audience size, accessibility, and acoustic suitability. A well-chosen venue enhances both performer comfort and audience experience.\n\nSound engineering plays one of the most critical roles in live concerts. Proper speaker positioning, mixing console calibration, and real-time monitoring ensure that every listener enjoys consistent sound clarity across the venue. Without professional audio planning, even the best performances can lose impact.\n\nLighting design adds emotional depth to the performance by synchronizing visual effects with musical transitions. Modern concerts use programmable lighting systems, LED walls, and laser effects to create immersive stage environments that keep audiences engaged throughout the event.\n\nAudience engagement strategies such as interactive event apps, live social media integration, surprise guest appearances, and synchronized crowd participation activities help maintain excitement and create memorable moments.\n\nWhen all these elements are carefully coordinated, a live concert becomes more than just a performance—it becomes an unforgettable experience that audiences remember long after the event ends.",
      image: "/images/Blog3.jpeg",
      date: "Oct 2025",
    }

  ];

  return (
    <section className="blog-section">

      <h2 className="blog-title">Latest Articles & News</h2>

      <div className="blog-container">

        {posts.map((post) => (

          <div className="blog-card" key={post.id}>

            <div className="blog-img-box">
              <img
                src={post.image}
                alt={post.title}
                className="blog-img"
              />
            </div>

            <div className="blog-content">

              <span className="blog-date">{post.date}</span>

              <h3 className="blog-card-title">
                {post.title}
              </h3>

              <p className="blog-desc">{post.desc}</p>

              <button
                className="blog-btn"
                onClick={() =>
                  navigate(`/blog-details/${post.id}`, {
                    state: post
                  })
                }
              >
                Read More
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}