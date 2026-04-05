import React, { useEffect } from 'react';
import './EventHighlight.css';

export default function EventHighlight() {

  useEffect(() => {
    const items = Array.from(document.querySelectorAll(".grid-item"));
    const lb = document.querySelector(".lightbox");
    if (!lb) return;

    const lbImage = lb.querySelector(".lb-image");
    const lbCaption = lb.querySelector(".lb-caption");
    const btnClose = lb.querySelector(".lb-close");
    const btnNext = lb.querySelector(".lb-next");
    const btnPrev = lb.querySelector(".lb-prev");

    let currentIndex = 0;

    function openLightbox(i) {
      const item = items[i];
      const img = item.querySelector("img");
      const caption = item.querySelector(".caption")?.textContent || "";

      lbImage.src = img.src;
      lbCaption.textContent = caption;
      lb.setAttribute("aria-hidden", "false");

      currentIndex = i;
    }

    function closeLightbox() {
      lb.setAttribute("aria-hidden", "true");
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % items.length;
      openLightbox(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      openLightbox(currentIndex);
    }

    items.forEach((btn, i) => {
      btn.onclick = () => openLightbox(i);
    });

    btnClose.onclick = closeLightbox;
    btnNext.onclick = showNext;
    btnPrev.onclick = showPrev;

    document.onkeydown = (e) => {
      if (lb.getAttribute("aria-hidden") === "false") {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
      }
    };
  }, []);

  return (
    <div className="events-wrapper">
      <section className="events-highlights" aria-labelledby="highlights-title">
        <h2 id="highlights-title">Event Highlights</h2>
        <p className="sub">Moments captured from our best events</p>

        <div className="grid">
          <button className="grid-item" data-index="0" aria-haspopup="dialog">
            <img src="images/event1.jpeg" alt="crowd at Music Fest" />
            <span className="caption">Music Fest - Live Crowd</span>
          </button>

          <button className="grid-item" data-index="1" aria-haspopup="dialog">
            <img src="images/Fs2.jpeg" alt="Outdoor food stalls" />
            <span className="caption">Food Carnival - Coastal Stalls</span>
          </button>

          <button className="grid-item" data-index="2" aria-haspopup="dialog">
            <img src="images/newevent.jpeg" alt="Stage performance" />
            <span className="caption">Evening Performance - Tagore Theatre</span>
          </button>

          <button className="grid-item" data-index="3" aria-haspopup="dialog">
            <img src="images/bg.jpeg" alt="Art expo interiors" />
            <span className="caption">Art & Culture Expo - Bangalore</span>
          </button>

          <button className="grid-item" data-index="4" aria-haspopup="dialog">
            <img src="images/wc.jpeg" alt="Festival lights" />
            <span className="caption">Winter Carnival - Lights</span>
          </button>

          <button className="grid-item" data-index="5" aria-haspopup="dialog">
            <img src="images/on1.jpeg" alt="Crowd cheering" />
            <span className="caption">Opening Night - Crowd Cheers</span>
          </button>
           <button className="grid-item" data-index="5" aria-haspopup="dialog">
            <img src="images/hm.jpg" alt="Crowd cheering" />
            <span className="caption">Heritage Flea:The Artisan Bazaar</span>
          </button>
           <button className="grid-item" data-index="5" aria-haspopup="dialog">
            <img src="images/bf.jpg" alt="Crowd cheering" />
            <span className="caption">World Book Fair:The Literary Hub</span>
          </button>
        </div>
      </section>

      <div className="lightbox" aria-hidden="true">
        <button className="lb-close">&times;</button>
        <button className="lb-prev">&larr;</button>

        <div className="lb-stage">
          <img className="lb-image" src="" alt="" />
          <div className="lb-caption"></div>
        </div>

        <button className="lb-next">&rarr;</button>
      </div>
    </div>
  );
}
