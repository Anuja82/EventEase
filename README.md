# 🎟️ EventEase — Full Stack Event Booking & Management Platform

EventEase is a full-stack event management and booking platform built using React and Django REST Framework.  
It supports complete event discovery, booking workflows, organizer dashboards, automated notifications, analytics, chatbot and client event hosting requests.

Designed as a production-style portfolio project demonstrating real-world workflow automation and scalable architecture.

---

#  Core Functional Modules

## 👤 User Features

✔ Secure user registration & authentication  
✔ Browse upcoming events  
✔ Event booking with real-time seat tracking  
✔ Booking cancellation with seat restoration  
✔ Wishlist (favorite events system)  
✔ Ticket PDF download after booking  
✔ Booking confirmation email automation  
✔ Personalized event recommendations  
✔ Profile editing & management  
✔ Notification (Hook Model)

---

# 📧 Automated Notification System

EventEase includes automated workflows using Django signal hooks:

✔ Automatic booking confirmation emails  
✔ Automatic organizer notification for new bookings  
✔ Automatic client request notification emails  
✔ Signal-based workflow automation (post-save hooks)

Workflow example:

Booking Created → Django Signal Triggered → Email Sent Automatically

---

# 🧾 Ticket Management System

✔ Ticket generation after booking  
✔ PDF ticket download support  
✔ Booking reference tracking system

---

# 🎯 Client Event Hosting Request System

Clients can directly request custom events:

✔ Submit event hosting requests  
✔ Organizer/admin receives email notification  
✔ Stored and managed inside admin dashboard  
✔ Enables automated request workflow pipeline

---

# ❤️ Wishlist System

✔ Add events to favorites  
✔ Remove events anytime  
✔ Persistent user-specific wishlist storage

---

# 👨‍💼 Organizer Dashboard

Organizers have access to a dedicated dashboard:

✔ Create new events  
✔ Manage My Events section  
✔ View bookings for their events  
✔ Track seat availability  
✔ Manage event lifecycle

---

# 🛠️ Admin Dashboard (Advanced Control Panel)

Admin panel includes powerful analytics and management tools:

✔ Manage users  
✔ Manage organizers  
✔ Manage events  
✔ Manage bookings  
✔ Monitor client event requests  
✔ Revenue analytics dashboard  
✔ Monthly booking analytics  
✔ Total users tracking  
✔ Total events tracking  
✔ Total revenue tracking

---

# 📊 Analytics Engine

EventEase includes built-in analytics features:

✔ Bookings per month tracking  
✔ Revenue trend monitoring  
✔ Event popularity insights  
✔ User engagement overview

---

# 🤖 AI Analytics Assistant

Integrated AI-powered helper module:

✔ Helps analyze platform activity  
✔ Supports admin insights  
✔ Improvised analytics interaction workflow

---

# 💬 Help Chatbot System

Integrated chatbot module:

✔ Provides user assistance  
✔ Answers platform usage queries  
✔ Improves onboarding experience

---

# 📰 Blog Module

✔ Platform-integrated blog system  
✔ Used for announcements & engagement  
✔ Content-driven user interaction support

---

# 🔐 Authentication & Security

✔ Secure login/logout system  
✔ Role-based dashboard access
    - User
    - Organizer
    - Admin
✔ Protected API routes

---

# ⚙️ Tech Stack

Frontend

React  
Axios  
CSS  

Backend

Django  
Django REST Framework  

Database

SQLite (Development)  
PostgreSQL-ready (Production compatible)

Automation

Django Signals (post-save hooks)

Media Handling (Production-ready design)

Cloudinary-ready architecture support

---

# 🧩 Architecture Highlights

✔ REST API based backend architecture  
✔ Component-based React UI structure  
✔ Signal-driven workflow automation  
✔ Role-based access system  
✔ Multi-dashboard architecture  
✔ Production-ready deployment configuration

---

# 📂 Project Structure

eventease/

backend/ → Django REST backend  
src/ → React frontend  
public/ → Static assets  

---

# ✨ Unique Highlights of EventEase

✔ Automated email notification system  
✔ Client-driven event hosting request workflow  
✔ Organizer dashboard with booking management  
✔ Admin analytics dashboard with revenue insights  
✔ Ticket PDF download feature  
✔ Wishlist interaction system  
✔ Analytics and automation-based system integration  
✔ Help chatbot module  
✔ Blog engagement module

---

# 🔮 Future Improvements

Online payment gateway integration  
Advanced recommendation engine  
Calendar-based event explorer  
Cloud image storage integration  
Live deployment with PostgreSQL & Cloudinary

---

# 👩‍💻 Author

Anuja R  
Full Stack Web Developer  
Focused on building scalable, UI-driven web applications
