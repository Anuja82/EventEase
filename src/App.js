import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import NotFound from './NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className='App'>
      <NavBar />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={
          <>
            <HeroSection />
            <About />
            <FeaturedEvents />
            <PopularEvents />
            <UpcomingEvents />
            <Testimonials />
            <Partners />
            <EventHighlight />
            <Blog />
            <Newsletter />
          </>
        } />

        {/* Public routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/shows/:category" element={<Shows />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/auth" element={<User />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/help" element={<HelpAI />} />
        <Route path="/host-event" element={<HostEvent />} />

        {/* User protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["user"]} />} />
        <Route path="/book/:id" element={<ProtectedRoute element={<BookingPage />} allowedRoles={["user"]} />} />
        <Route path="/payment" element={<ProtectedRoute element={<PaymentPage />} allowedRoles={["user"]} />} />
        <Route path="/booking-success" element={<ProtectedRoute element={<BookingSuccess />} allowedRoles={["user"]} />} />
        <Route path="/view-ticket" element={<ProtectedRoute element={<ViewTicket />} allowedRoles={["user"]} />} />

        {/* Organizer protected routes */}
        <Route path="/organizer-dashboard" element={<ProtectedRoute element={<OrganizerDB />} allowedRoles={["organizer"]} />} />
        <Route path="/create-event" element={<ProtectedRoute element={<CreateEvent />} allowedRoles={["organizer"]} />} />
        <Route path="/myevents" element={<ProtectedRoute element={<MyEvents />} allowedRoles={["organizer"]} />} />
        <Route path="/organizer-profile" element={<ProtectedRoute element={<OrganizerProfile />} allowedRoles={["organizer"]} />} />
        <Route path="/organizer-bookings" element={<ProtectedRoute element={<OrganizerBooking />} allowedRoles={["organizer"]} />} />

        {/* Admin protected routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
        <Route path="/admin-users" element={<ProtectedRoute element={<ManageUsers />} allowedRoles={["admin"]} />} />
        <Route path="/admin-organizers" element={<ProtectedRoute element={<ManageOrganizers />} allowedRoles={["admin"]} />} />
        <Route path="/admin-events" element={<ProtectedRoute element={<ManageEvents />} allowedRoles={["admin"]} />} />
        <Route path="/admin-bookings" element={<ProtectedRoute element={<ViewBookings />} allowedRoles={["admin"]} />} />
        <Route path="/admin-revenue" element={<ProtectedRoute element={<RevenueAnalytics />} allowedRoles={["admin"]} />} />
        <Route path="/admin-ai" element={<ProtectedRoute element={<AIAnalytics />} allowedRoles={["admin"]} />} />
        <Route path="/admin-client-requests" element={<ProtectedRoute element={<AdminClientRequests />} allowedRoles={["admin"]} />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;