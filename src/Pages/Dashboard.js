
import React, { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";

function Dashboard() {

  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    total_events: 0,
    tickets_booked: 0,
    upcoming: 0,
    latest_booking: null
  });

  const [wishlistCount, setWishlistCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [recommended, setRecommended] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  //  EDIT PROFILE STATES

  const [showEdit, setShowEdit] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const userId = localStorage.getItem("user_id");

  const userEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("user_email") ||
    localStorage.getItem("email");

  const role = localStorage.getItem("role");


  useEffect(() => {

    if (role !== "user") {
      navigate("/auth");
      return;
    }

    if (!userEmail) {
      navigate("/auth");
      return;
    }

    axios.get(
      //"http://127.0.0.1:8000/api/user-dashboard/",
      `${API_BASE_URL}/api/user-dashboard/`,
      { params: { userEmail } }
    )
    .then(res => {
      setData(res.data);
      setEditEmail(userEmail);
    });

    if (userId) {

      axios.get(
        //`http://127.0.0.1:8000/api/my-wishlist/${userId}/`
        `${API_BASE_URL}/api/my-wishlist/${userId}/`
      )
      .then(res => {
        setWishlistCount(res.data.length);
        setWishlist(res.data.map(i => i.event.id));
      });

      axios.get(
        //`http://127.0.0.1:8000/api/event-reminders/${userId}/`
        `${API_BASE_URL}/api/event-reminders/${userId}/`
      )
      .then(res =>
        setNotificationCount(res.data.length)
      );

      axios.get(
       // `http://127.0.0.1:8000/api/recommended-events/${userId}/`
       `${API_BASE_URL}/api/recommended-events/${userId}/`
      )
      .then(res =>
        setRecommended(res.data)
      );

    }

  }, []);


  // ❤️ TOGGLE WISHLIST

  const toggleWishlist = async (eventId) => {

    if (!userId)
      return alert("Login first");

    try {

      if (wishlist.includes(eventId)) {

        await axios.delete(
         // `http://127.0.0.1:8000/api/remove-wishlist/${eventId}/${userId}/`
         `${API_BASE_URL}/api/remove-wishlist/${eventId}/${userId}/`
        );

        setWishlist(
          wishlist.filter(id => id !== eventId)
        );

        setWishlistCount(prev => prev - 1);

      } else {

        await axios.post(
          //"http://127.0.0.1:8000/api/add-wishlist/",
          `${API_BASE_URL}/api/add-wishlist/`,
          {
            user_id: userId,
            event_id: eventId
          }
        );

        setWishlist([...wishlist, eventId]);

        setWishlistCount(prev => prev + 1);

      }

    } catch (err) {

      console.log(err);

    }

  };


  //  OPEN WISHLIST MODAL

  const openWishlistModal = () => {

    axios.get(
     // `http://127.0.0.1:8000/api/my-wishlist/${userId}/`
     `${API_BASE_URL}/api/my-wishlist/${userId}/`
    )
    .then(res => {

      setWishlistItems(res.data);
      setShowWishlistModal(true);

    });

  };


  //  OPEN NOTIFICATION MODAL

  const openNotificationModal = () => {

    axios.get(
      //`http://127.0.0.1:8000/api/event-reminders/${userId}/`
      `${API_BASE_URL}/api/event-reminders/${userId}/`
    )
    .then(res => {

      setNotifications(res.data);
      setShowNotificationModal(true);

    });

  };


  //  UPDATE PROFILE FUNCTION

  const updateProfile = () => {

    axios.put(
      //"http://127.0.0.1:8000/api/update-profile/",
      `${API_BASE_URL}/api/update-profile/`,
      {
        old_email: userEmail,
        email: editEmail,
        password: editPassword
      }
    )
    .then(() => {

      alert("Profile updated successfully");

      localStorage.setItem("userEmail", editEmail);

      setShowEdit(false);

      setEditPassword("");

    })
    .catch(() => {

      alert("Update failed");

    });

  };


  const logout = () => {

    localStorage.clear();

    navigate("/auth");

  };


  const goToTicket = () => {

    if (!data.latest_booking)
      return alert("No ticket found");

    navigate(
      "/view-ticket",
      { state: data.latest_booking }
    );

  };


  return (

    <div className="dashboard-wrapper">

      <PageHeader
        title="Dashboard"
        subtitle="Manage your events"
      />


      <div className="dashboard-container">


        {/* HEADER */}

        <div className="dashboard-header">

          <div></div>

          <h2 className="wlm-text center-text">

            Welcome back,
            <span> {data.username}</span>

          </h2>


          <div className="dashboard-icons">

            <div
              className="icon-box"
              onClick={openWishlistModal}
            >
              ❤️
              {wishlistCount > 0 &&
                <span className="icon-badge">
                  {wishlistCount}
                </span>}
            </div>


            <div
              className="icon-box"
              onClick={openNotificationModal}
            >
              🔔
              {notificationCount > 0 &&
                <span className="icon-badge">
                  {notificationCount}
                </span>}
            </div>

          </div>

        </div>


        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">
            <p>Total Events</p>
            <h1>{data.total_events}</h1>
          </div>

          <div className="stat-card">
            <p>Tickets Booked</p>
            <h1>{data.tickets_booked}</h1>
          </div>

          <div className="stat-card">
            <p>Upcoming</p>
            <h1>{data.upcoming}</h1>
          </div>

        </div>


        {/* ACTION BUTTONS */}

        <div className="action-buttons">

          <button
            className="primary-btn"
            onClick={goToTicket}
          >
            Download Ticket
          </button>


          <button
            className="secondary-btn"
            onClick={() =>
              setShowEdit(!showEdit)
            }
          >
            Edit Profile
          </button>


          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>


        {/* EDIT PROFILE BOX */}

        {showEdit && (

          <div className="edit-profile-box">

            <h3>Edit Profile</h3>

            <input
              type="email"
              value={editEmail}
              onChange={(e)=>
                setEditEmail(e.target.value)
              }
            />

            <input
              type="password"
              value={editPassword}
              placeholder="New password"
              onChange={(e)=>
                setEditPassword(e.target.value)
              }
            />

            <button
              className="primary-btn"
              onClick={updateProfile}
            >
              Save Changes
            </button>

          </div>

        )}


        {/* RECOMMENDED EVENTS SECTION (unchanged below) */}

        <div className="recommended-section">

          <h3>Recommended for you</h3>

          {recommended.length === 0
            ? <p>No recommendations yet</p>
            : (
              <div className="recommended-grid">

                {recommended.map(event => (

                  <div
                    className="show-card"
                    key={event.id}
                  >

                    <div className="image-wrapper">

                      <img
                        src={
                          event.image
                            //? `http://127.0.0.1:8000${event.image}`
                           ? `${API_BASE_URL}${event.image}`
                            : "/default-event.jpg"
                        }
                        alt={event.title}
                      />

                      <span
                        className={
                          wishlist.includes(event.id)
                            ? "heart active"
                            : "heart"
                        }
                        onClick={() =>
                          toggleWishlist(event.id)
                        }
                      >
                        ❤
                      </span>

                    </div>


                    <div className="show-info">

                      <h3>{event.title}</h3>

                      <span>{event.date}</span>

                      <p>{event.venue}</p>

                      <button
                        onClick={() =>
                          navigate(`/event/${event.id}`)
                        }
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </div>

      </div>



      
       {/*  WISHLIST MODAL */}

       {showWishlistModal && (

         <div
           className="modal-overlay"
           onClick={() =>
             setShowWishlistModal(false)
           }
         >

           <div
             className="wishlist-modal"
             onClick={e => e.stopPropagation()}
           >

             <h3>Your Wishlist</h3>

             {wishlistItems.length === 0 ?

               <p>No wishlist items yet</p>

               :

               wishlistItems.map(item => (

                 <div
                   className="wishlist-item"
                  key={item.id}
                 >

                   <span>
                     {item.event.title}                   </span>

                   <button
                     onClick={() =>
                       navigate(`/event/${item.event.id}`)
                     }
                   >
                     View Event
                   </button>

                 </div>

               ))

             }

             <button
               className="close-btn"
               onClick={() =>
                 setShowWishlistModal(false)
              }
             >
               Close
             </button>

           </div>

         </div>

       )}


       {/*  NOTIFICATION MODAL */}

      {showNotificationModal && (

         <div
           className="modal-overlay"
           onClick={() =>
             setShowNotificationModal(false)
           }
         >

          <div
            className="wishlist-modal"
             onClick={e => e.stopPropagation()}           >

             <h3>Upcoming Event Reminders</h3>

             {notifications.length === 0 ?

               <p>No notifications available</p>

               :

               notifications.map(note => (

                 <div
                   className="wishlist-item"
                   key={note.id}
                 >

                   <span>
                     {note.event.title}
                     {" "}is coming soon 🎉
                   </span>

                   <button
                     onClick={() =>
                       navigate(`/event/${note.event.id}`)
                     }
                   >
                     View Event
                   </button>

                 </div>

               ))

             }

             <button
               className="close-btn"
               onClick={() =>
                 setShowNotificationModal(false)
               }
             >
               Close
             </button>

           </div>

         </div>

       )}

     


    </div>

  );

}

export default Dashboard;



