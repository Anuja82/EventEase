import React from 'react';
import { Routes,Route } from 'react-router-dom';

import { useEffect } from 'react';
import './App.css';
import HeroSection from './HeroSection/HeroSection';
import NavBar from './NavBar/NavBar';
import About from './About/About';
import AboutPage from './About/AboutPage';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FeaturedEvents from './FeaturedEvents/FeaturedEvents';
import PopularEvents from './PopularEvents/PopularEvents';
import UpcomingEvents from './UpcomingEvents/UpcomingEvents';
import Testimonials from './Testimonials/Testimonials';
import Partners from './Partners/Partners';
import EventHighlight from './EventHighlight/EventHighlight';
import Blog from './Blog/Blog';
import Newsletter from './Newsletter/Newsletter';
import EventPage from './PopularEvents/PopularPage';
import BlogPage from './Blog/BlogPage';
import Shows from './Shows/Show';
import User from './User/User';
import Dashboard from './Pages/Dashboard';
import OrganizerDB from './Organizer/OrganizerDB';
import CreateEvent from "./Organizer/CreateEvent";
import MyEvents from "./Organizer/MyEvents";
import OrganizerProfile from "./Organizer/OrganizerProfile";
import EventDetails from "./EventDetails/EventDetails";
import BookingPage from './Booking/BookingPage';
import PaymentPage from "./Payment/PaymentPage";
import BookingSuccess from './BookingSuccess/BookingSuccess';
import ViewTicket from './ViewTicket/ViewTicket';
import OrganizerBooking from './Organizer/OrganizerBooking';
import SearchResults from './Search/SearchPage';
import AdminDashboard from "./Admin/AdminDashboard";
import ManageUsers from './Admin/ManageUsers';
import ManageOrganizers from './Admin/ManageOrganizer';
import ManageEvents from './Admin/ManageEvents';
import ViewBookings from './Admin/ViewBookings';
import RevenueAnalytics from './Admin/RevenueAnalytics';
import AIAnalytics from './Admin/AIAnalytics';
import HelpAI from './Help/HelpAI';
import BlogDetails from './Blog/BlogDetails';
import HostEvent from './HostEvent/HostEvent';
import AdminClientRequests from './Admin/AdminClientRequests';
import AdminLogin from './Admin/AdminLogin';
function App(){
  useEffect(()=>{
    AOS.init({duration:1000,once:true});
  },[]);
  return(
    <div className='App'>
      <NavBar/>
        <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
      <HeroSection/>
 
      <About/>
     
      <FeaturedEvents/>
      <PopularEvents/>
      <UpcomingEvents/>
      <Testimonials/>
       <Partners/>
      <EventHighlight/>
      <Blog/>
      
      </>
          }
          />
           <Route path="/about" element={<AboutPage />} />
           <Route path='/event' element={<EventPage />} />
           <Route path='/blog' element={<BlogPage/>}    />
           <Route path='/shows' element={<Shows/>}/>
           <Route path='/auth' element={<User />} />
           <Route path='/dashboard' element={<Dashboard/>}/>
           <Route path="/create-event" element={<CreateEvent />} />
           <Route path="/organizer-dashboard" element={<OrganizerDB />} />
           <Route path="/myevents" element={<MyEvents />} />
           <Route path="/shows/:category" element={<Shows />} />
           <Route path="/organizer-profile" element={<OrganizerProfile />} />
           <Route path="/event/:id" element={<EventDetails />} />
           <Route path="/book/:id" element={<BookingPage />} />
           <Route path="/payment" element={<PaymentPage />} />
           <Route path="/booking-success" element={<BookingSuccess />} />
           <Route path="/view-ticket" element={<ViewTicket />} />
           <Route path="/organizer-bookings" element={<OrganizerBooking />} />
           <Route path="/search" element={<SearchResults />} />
           <Route path="/admin-dashboard" element={<AdminDashboard />} />
           <Route path="/admin-users" element={<ManageUsers />} />
           <Route path="/admin-organizers" element={<ManageOrganizers />} />
           <Route path="/admin-events" element={<ManageEvents />} />
           <Route path="/admin-bookings" element={<ViewBookings />} />
           <Route path="/admin-revenue" element={<RevenueAnalytics />} />
           <Route path="/admin-ai" element={<AIAnalytics />} />
           <Route path='/help' element={<HelpAI />} />
           <Route path="/blog-details/:id" element={<BlogDetails />} />
           <Route path="/host-event" element={<HostEvent />} />
           <Route path="/admin-client-requests" element={<AdminClientRequests />} />
           <Route path="/admin-login" element={<AdminLogin />} />

           
           </Routes>
      <Newsletter/>
      
    </div>
  );
}

export default App;
