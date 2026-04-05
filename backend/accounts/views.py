from django.shortcuts import render
from django.http import JsonResponse 
import json
from .models import Register
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Event,Booking,Wishlist
from .serializers import EventSerializer
from accounts.models import Register
from .models import Register, AccountDeletionRequest
from .serializers import BookingSerializer
from django.utils.timezone import now
from datetime import date,timedelta,datetime
from django.db.models import Sum, F
from django.db.models.functions import TruncMonth
from django.db.models import Count
from .serializers import UserSerializer
from .serializers import OrganizerSerializer
from .serializers import AdminEventSerializer,AdminBookingSerializer
from django.db.models.functions import ExtractHour, ExtractWeekDay
from django.db.models.functions import ExtractHour
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse
from django.core.mail import EmailMultiAlternatives
from .models import HostEvent
from .serializers import HostEventSerializer
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from .models import NewsletterSubscriber



@csrf_exempt
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        role = data.get("role", "user")  

        # Validation
        if not username or not email or not password or not confirm_password:
            return JsonResponse({"error": "All fields are required"}, status=400)

        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        if Register.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        # Prevent admin self registration
        if role == "admin":
            return JsonResponse({"error": "Admin cannot register"}, status=403)

        # Create user
        Register.objects.create(
            username=username,
            email=email,
            password=password,
            confirm_password=confirm_password,
            role=role
        )

        return JsonResponse({
            "message": f"{role.capitalize()} registered successfully"
        })

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        try:
            user = Register.objects.get(email=email)

            if user.password == password:
                return JsonResponse({
                    "message": "Login successful",
                    "user_id": user.id,      
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                })

            else:
                return JsonResponse({"error": "Invalid password"}, status=400)

        except Register.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse({"error": "Only POST allowed"}, status=405)

@api_view(["POST"])
def create_event(request):

    email = request.data.get("organizer_email")

    try:
        organizer = Register.objects.get(email=email)
    except Register.DoesNotExist:
        return Response({"error": "Organizer not found"}, status=404)

    serializer = EventSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(organizer=organizer)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# PUBLIC EVENTS 
@api_view(["GET"])
def public_events(request):

    events = Event.objects.filter(status="Active")
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_events(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def organizer_events(request):
    email = request.GET.get("email")

    try:
        organizer = Register.objects.get(email=email)
    except Register.DoesNotExist:
        return Response({"error": "Organizer not found"}, status=404)

    events = Event.objects.filter(organizer=organizer)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)
@api_view(["PUT"])
def update_event(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)

    serializer = EventSerializer(event, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
@api_view(["DELETE"])
def delete_event(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)

    event.delete()
    return Response({"message": "Event deleted successfully"})
@api_view(["PUT"])
def update_profile(request):
    email = request.data.get("email")

    try:
        user = Register.objects.get(email=email)
    except Register.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    user.username = request.data.get("username", user.username)

    new_password = request.data.get("password")
    if new_password:
        user.password = new_password
        user.confirm_password = new_password

    user.save()

    return Response({"message": "Profile updated successfully"})

@api_view(["POST"])
def request_account_deletion(request):
    email = request.data.get("email")

    try:
        user = Register.objects.get(email=email)
    except Register.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Prevent duplicate requests
    if AccountDeletionRequest.objects.filter(user=user, status="Pending").exists():
        return Response({"message": "Deletion already requested"})

    AccountDeletionRequest.objects.create(user=user)

    return Response({"message": "Deletion request sent to admin"})


    
@api_view(["GET"])
def get_event_detail(request, id):
    try:
        event = Event.objects.get(id=id)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)

    serializer = EventSerializer(event)
    return Response(serializer.data)


@csrf_exempt
def create_booking(request):

    if request.method == "POST":
        data = json.loads(request.body)

        user_id = data.get("user_id")
        event_id = data.get("event_id")
        tickets = int(data.get("tickets"))

        try:
            user = Register.objects.get(id=user_id)
            event = Event.objects.get(id=event_id)

            booking = Booking.objects.create(
                user=user,
                event=event,
                tickets=tickets
            )

            # EVENTEASE HTML EMAIL TEMPLATE
            subject = "🎟 Booking Confirmed – EventEase"

            html_content = f"""
            <div style="font-family: Arial; background:#0d001a; padding:30px; color:white;">

                <div style="
                    max-width:500px;
                    margin:auto;
                    background:#140024;
                    padding:30px;
                    border-radius:12px;
                    border:1px solid rgba(255,0,128,0.3);
                ">

                    <h2 style="color:#ff0080;">
                        Booking Confirmed 🎟
                    </h2>

                    <p>Hello <b>{user.username}</b>,</p>

                    <p>Your ticket booking is successful!</p>

                    <hr style="border:0.5px solid #333;" />

                    <p><b>Event:</b> {event.title}</p>

                    <p><b>Date:</b> {event.date}</p>

                    <p><b>Venue:</b> {event.venue}</p>

                    <p><b>Tickets:</b> {booking.tickets}</p>

                    <p><b>Total Price:</b> ₹{booking.total_price}</p>

                    <hr style="border:0.5px solid #333;" />

                    <p>Thank you for booking with us 💜</p>

                    <p style="color:#ff0080; font-weight:bold;">
                        Thanks & Regards,<br>
                        EventEase Team
                    </p>

                </div>

            </div>
            """

            email = EmailMultiAlternatives(
                subject,
                "",
                settings.EMAIL_HOST_USER,
                [user.email],
            )

            email.attach_alternative(html_content, "text/html")

            email.send(fail_silently=True)

            return JsonResponse({
                "message": "Booking successful",
                "booking_id": booking.id,
                "event": event.title,
                "tickets": booking.tickets,
                "total_price": booking.total_price,
                "status": booking.status
            })

        except Register.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

        except Event.DoesNotExist:
            return JsonResponse({"error": "Event not found"}, status=404)

        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST allowed"}, status=405)

def user_bookings(request, user_id):

    try:
        bookings = Booking.objects.filter(user_id=user_id)

        data = []

        for booking in bookings:
            data.append({
                "booking_id": booking.id,
                "event": booking.event.title,
                "tickets": booking.tickets,
                "total_price": booking.total_price,
                "status": booking.status,
                "booked_at": booking.booked_at
            })

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
def booking_detail(request, booking_id):

    try:
        booking = Booking.objects.get(id=booking_id)

        data = {
            "booking_id": booking.id,
            "user": booking.user.username,
            "event": booking.event.title,
            "tickets": booking.tickets,
            "total_price": booking.total_price,
            "status": booking.status,
            "booked_at": booking.booked_at
        }

        return JsonResponse(data)

    except Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)
    
@csrf_exempt
def cancel_booking(request, booking_id):

    if request.method == "POST":

        try:
            booking = Booking.objects.get(id=booking_id)

            if booking.status == "Cancelled":
                return JsonResponse({"error": "Booking already cancelled"})

            booking.status = "Cancelled"

            # Restore seats
            event = booking.event
            event.available_seats += booking.tickets
            event.save()

            booking.save()

            return JsonResponse({
                "message": "Booking cancelled successfully"
            })

        except Booking.DoesNotExist:
            return JsonResponse({"error": "Booking not found"}, status=404)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


def all_bookings(request):

    bookings = Booking.objects.all()

    data = []

    for booking in bookings:
        data.append({
            "booking_id": booking.id,
            "user": booking.user.email,
            "event": booking.event.title,
            "tickets": booking.tickets,
            "total_price": booking.total_price,
            "status": booking.status,
            "booked_at": booking.booked_at
        })

    return JsonResponse(data, safe=False)

@api_view(['GET'])
def organizer_dashboard(request):

    email = request.GET.get("email")

    try:
        organizer = Register.objects.get(email=email)
    except Register.DoesNotExist:
        return Response({"error": "Organizer not found"}, status=404)

    # Organizer events
    events = Event.objects.filter(organizer=organizer).order_by("-date")

    serializer = EventSerializer(events, many=True)

    # Dashboard stats
    total_events = events.count()

    bookings = Booking.objects.filter(event__organizer=organizer)

    total_bookings = bookings.count()

    revenue = bookings.aggregate(Sum("total_price"))["total_price__sum"] or 0

    upcoming = events.filter(date__gte=now().date()).count()

    stats = {
        "total_events": total_events,
        "total_bookings": total_bookings,
        "revenue": revenue,
        "upcoming": upcoming,
    }

    return Response({
        "events": serializer.data,
        "stats": stats
    })


@api_view(['GET'])
def user_dashboard(request):

    email = request.GET.get("userEmail")

    try:
        user = Register.objects.get(email=email)
    except Register.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    total_events = Event.objects.count()

    bookings = Booking.objects.filter(
        user=user,
        status="Booked"
    ).select_related("event")

    tickets_booked = bookings.count()

    upcoming = bookings.filter(
        event__date__gte=now().date()
    ).count()

    # latest booking details
    latest_booking = bookings.last()

    latest_ticket = None

    if latest_booking:
        latest_ticket = {
            "event": {
                "title": latest_booking.event.title,
                "date": latest_booking.event.date,
                "time": latest_booking.event.time,
                "venue": latest_booking.event.venue,
            },
            "tickets": latest_booking.tickets,
        }

    return Response({
        "username": user.username,
        "total_events": total_events,
        "tickets_booked": tickets_booked,
        "upcoming": upcoming,
        "latest_booking": latest_ticket
    })



@api_view(['GET'])
def organizer_bookings(request):

    email = request.GET.get("email")

    try:
        organizer = Register.objects.get(email=email)
    except Register.DoesNotExist:
        return Response({"error": "Organizer not found"}, status=404)

    events = Event.objects.filter(organizer=organizer)

    bookings = Booking.objects.filter(event__in=events)

    data = []

    for booking in bookings:
        data.append({
            "event_title": booking.event.title,
            "event_date": booking.event.date,
            "user": booking.user.email,   
            "tickets": booking.tickets,
            "total_price": booking.total_price,
            "booking_date": booking.booked_at
        })

    return Response(data)

@api_view(["GET"])
def search_events(request):

    query = request.GET.get("query")

    events = Event.objects.filter(title__icontains=query)

    data = []

    for event in events:
        data.append({
            "id": event.id,
            "title": event.title,
            "date": event.date,
            "price": event.price,
            "venue": event.venue,
            "image": event.image.url if event.image else None
        })

    return Response(data)

@api_view(['GET'])
def admin_dashboard_stats(request):

    total_users = Register.objects.filter(role='user').count()
    total_events = Event.objects.count()
    total_bookings = Booking.objects.count()

    revenue = Booking.objects.filter(status="Booked").aggregate(
        total=Sum('total_price')
    )['total'] or 0

    data = {
        "total_users": total_users,
        "total_events": total_events,
        "total_bookings": total_bookings,
        "total_revenue": revenue
    }

    return Response(data)

@api_view(['GET'])
def bookings_per_month(request):

    bookings = (
        Booking.objects
        .filter(status="Booked")
        .annotate(month=TruncMonth('booked_at'))
        .values('month')
        .annotate(total=Count('id'))
        .order_by('month')
    )

    data = []

    for b in bookings:
        data.append({
            "month": b["month"].strftime("%b"),
            "total": b["total"]
        })

    return Response(data)

@api_view(["GET"])
def get_all_users(request):

    users = Register.objects.filter(role="user")

    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def search_users(request):

    query = request.GET.get("search", "")

    users = Register.objects.filter(
        role="user",
        username__icontains=query
    ) | Register.objects.filter(
        role="user",
        email__icontains=query
    )

    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(["PUT"])
def toggle_user_status(request, user_id):

    try:
        user = Register.objects.get(id=user_id)

        user.is_active = not user.is_active
        user.save()

        return Response({
            "message": "User status updated",
            "is_active": user.is_active
        })

    except Register.DoesNotExist:
        return Response({"error": "User not found"})
    



@api_view(["GET"])
def user_booking_history(request, user_id):

    bookings = Booking.objects.filter(user_id=user_id)

    serializer = BookingSerializer(bookings, many=True)

    return Response(serializer.data)

@api_view(["DELETE"])
def delete_user(request, user_id):

    try:
        user = Register.objects.get(id=user_id)
        user.delete()

        return Response({"message": "User deleted successfully"})

    except Register.DoesNotExist:
        return Response({"error": "User not found"})
    
# organizer 
@api_view(['GET'])
def admin_organizers(request):
    organizers = Register.objects.filter(role="organizer")
    serializer = OrganizerSerializer(organizers, many=True)
    return Response(serializer.data)


# APPROVE ORGANIZER 
@api_view(['PUT'])
def approve_organizer(request, id):
    try:
        organizer = Register.objects.get(id=id)

        
        organizer.is_active = True
        organizer.save()

        return Response({"message": "Organizer approved"})
    except Register.DoesNotExist:
        return Response({"error": "Organizer not found"}, status=404)


#BLOCK / UNBLOCK ORGANIZER
@api_view(['PUT'])
def toggle_organizer(request, id):
    try:
        organizer = Register.objects.get(id=id)

        organizer.is_active = not organizer.is_active
        organizer.save()

        return Response({"message": "Status updated"})
    except Register.DoesNotExist:
        return Response({"error": "Organizer not found"}, status=404)


# VIEW EVENTS OF ORGANIZER
@api_view(['GET'])
def organizer_event(request, id):
    events = Event.objects.filter(organizer_id=id)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


# APPROVE DELETE REQUEST
@api_view(['DELETE'])
def approve_delete(request, id):
    try:
        delete_request = AccountDeletionRequest.objects.get(id=id)

        user = delete_request.user
        user.delete()  # delete organizer

        delete_request.delete()

        return Response({"message": "Organizer deleted"})
    except AccountDeletionRequest.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

@api_view(['GET'])
def admin_events(request):
    events = Event.objects.all().order_by("-created_at")
    serializer = AdminEventSerializer(events, many=True)
    return Response(serializer.data)


#  APPROVE EVENT
@api_view(['PUT'])
def approve_event(request, id):
    try:
        event = Event.objects.get(id=id)
        event.status = "Active"
        event.save()
        return Response({"message": "Event approved"})
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)


# REJECT EVENT
@api_view(['PUT'])
def reject_event(request, id):
    try:
        event = Event.objects.get(id=id)
        event.status = "Completed"   
        event.save()
        return Response({"message": "Event rejected"})
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)

@api_view(['PUT'])
def update_event(request, pk):
    try:
        event = Event.objects.get(id=pk)

        serializer = EventSerializer(event, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated"})

        return Response(serializer.errors, status=400)

    except Event.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
@api_view(['DELETE'])
def delete_event(request, pk):
    try:
        event = Event.objects.get(id=pk)
        event.delete()
        return Response({"message": "Event deleted"})

    except Event.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    
# Booking
@api_view(['GET'])
def admin_bookings(request):
    bookings = Booking.objects.all().order_by('-booked_at')
    serializer = AdminBookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def admin_revenue(request):

    # TOTAL REVENUE
    total_revenue = Booking.objects.aggregate(
        total=Sum('total_price')
    )['total'] or 0


    # REVENUE BY EVENT
    revenue_by_event = Booking.objects.values(
        'event__title'
    ).annotate(
        revenue=Sum('total_price')
    ).order_by('-revenue')


    # REVENUE BY ORGANIZER
    revenue_by_organizer = Booking.objects.values(
        'event__organizer__username'
    ).annotate(
        revenue=Sum('total_price')
    ).order_by('-revenue')


    return Response({

        "total_revenue": total_revenue,

        "revenue_by_event": [
            {
                "event_title": item['event__title'],
                "revenue": item['revenue']
            }
            for item in revenue_by_event
        ],

        "revenue_by_organizer": [
            {
                "organizer_name": item['event__organizer__username'],
                "revenue": item['revenue']
            }
            for item in revenue_by_organizer
        ]

    })



@api_view(['GET'])
def ai_analytics(request):

    today = now()

    last_week = today - timedelta(days=7)
    last_2_weeks = today - timedelta(days=14)
    last_3_weeks = today - timedelta(days=21)
    last_4_weeks = today - timedelta(days=28)


    # --------------------------------------------------
    # Weekend vs weekday booking trend
    # --------------------------------------------------

    weekend_bookings = Booking.objects.filter(
        booked_at__week_day__in=[1,7]
    ).count()

    weekday_bookings = Booking.objects.exclude(
        booked_at__week_day__in=[1,7]
    ).count()

    weekend_prediction = (
        "Users prefer booking on weekends"
        if weekend_bookings > weekday_bookings
        else "Users prefer booking on weekdays"
    )


    # --------------------------------------------------
    # Best category detection
    # --------------------------------------------------

    best_category = Event.objects.values(
        "category"
    ).annotate(
        total=Count("category")
    ).order_by("-total").first()

    best_category_result = (
        best_category["category"]
        if best_category else "No category data"
    )


    # --------------------------------------------------
    # Peak booking hour detection
    # --------------------------------------------------

    peak_hour = Booking.objects.annotate(
        hour=ExtractHour("booked_at")
    ).values("hour").annotate(
        total=Count("id")
    ).order_by("-total").first()

    peak_booking_time = (
        f"{peak_hour['hour']}:00"
        if peak_hour else "No booking data"
    )


    # --------------------------------------------------
    # Most popular event
    # --------------------------------------------------

    popular_event = Event.objects.annotate(
        total_bookings=Count("bookings")
    ).order_by("-total_bookings").first()

    popular_event_name = (
        popular_event.title
        if popular_event else "No events available"
    )


    # --------------------------------------------------
    # Organizer count
    # --------------------------------------------------

    organizer_count = Register.objects.filter(
        role="organizer"
    ).count()


    # --------------------------------------------------
    # Booking growth prediction
    # --------------------------------------------------

    week1 = Booking.objects.filter(
        booked_at__gte=last_week
    ).count()

    week2 = Booking.objects.filter(
        booked_at__gte=last_2_weeks,
        booked_at__lt=last_week
    ).count()

    week3 = Booking.objects.filter(
        booked_at__gte=last_3_weeks,
        booked_at__lt=last_2_weeks
    ).count()

    week4 = Booking.objects.filter(
        booked_at__gte=last_4_weeks,
        booked_at__lt=last_3_weeks
    ).count()

    avg_previous = (week2 + week3 + week4) / 3 if (week2 + week3 + week4) else 1

    growth_percentage = round(
        ((week1 - avg_previous) / avg_previous) * 100
    )

    booking_prediction = (
        f"Bookings expected to increase by {growth_percentage}% next weekend"
        if growth_percentage > 0
        else f"Bookings expected to decrease by {abs(growth_percentage)}% next weekend"
    )


    # --------------------------------------------------
    # NEW: Seat-demand prediction per category
    # --------------------------------------------------

    category_demand = Event.objects.annotate(
        booked_seats=F("total_seats") - F("available_seats")
    ).values("category").annotate(
        total_booked=Sum("booked_seats"),
        total_capacity=Sum("total_seats")
    ).order_by("-total_booked").first()

    if category_demand and category_demand["total_capacity"]:

        demand_percentage = round(
            (category_demand["total_booked"]
             / category_demand["total_capacity"]) * 100
        )

        seat_prediction = (
            f"{category_demand['category']} events show highest seat demand "
            f"({demand_percentage}% occupancy trend)"
        )

    else:

        seat_prediction = "Not enough data for seat-demand prediction"


    return Response({

        "weekend_prediction": weekend_prediction,
        "best_category": best_category_result,
        "peak_booking_time": peak_booking_time,
        "popular_event": popular_event_name,
        "organizer_count": organizer_count,
        "booking_prediction": booking_prediction,
        "seat_prediction": seat_prediction

    })



@api_view(["POST"])
def chatbot(request):

    message = request.data.get("message", "").lower()


    # -----------------------------
    # BOOK TICKETS HELP
    # -----------------------------

    if any(word in message for word in ["book ticket", "book tickets", "how to book", "ticket booking"]):

        return Response({
            "reply": "To book tickets: Go to Shows page → Select your event → Click Book Ticket → Choose Seats → Confirm booking."
        })


    # -----------------------------
    # VIEW MY BOOKINGS
    # -----------------------------

    elif any(word in message for word in ["my tickets", "my bookings", "view tickets", "see my tickets"]):

        return Response({
            "reply": "You can view your booked tickets inside the My Bookings section in your dashboard."
        })


    # -----------------------------
    # CANCEL BOOKINGS
    # -----------------------------

    elif any(word in message for word in ["cancel ticket", "cancel booking"]):

        return Response({
            "reply": "To cancel tickets: Open My Bookings → Select your booking → Click Cancel."
        })


    # -----------------------------
    # TOTAL EVENTS
    # -----------------------------

    elif "event" in message:

        total = Event.objects.count()

        return Response({
            "reply": f"There are {total} events available on EventEase."
        })


    # -----------------------------
    # TOTAL ORGANIZERS
    # -----------------------------

    elif "organizer" in message:

        total = Register.objects.filter(role="organizer").count()

        return Response({
            "reply": f"There are {total} organizers registered on the platform."
        })


    # -----------------------------
    # TOTAL USERS
    # -----------------------------

    elif "user" in message:

        total = Register.objects.filter(role="user").count()

        return Response({
            "reply": f"There are {total} users registered on EventEase."
        })


    # -----------------------------
    # TOTAL BOOKINGS
    # -----------------------------

    elif any(word in message for word in ["booking", "tickets"]):

        total = Booking.objects.count()

        return Response({
            "reply": f"There are {total} bookings made so far."
        })


    # -----------------------------
    # POPULAR CATEGORY
    # -----------------------------

    elif "category" in message or "popular" in message:

        category = (
            Event.objects.values("category")
            .annotate(total=Count("id"))
            .order_by("-total")
            .first()
        )

        if category:

            return Response({
                "reply": f"The most popular event category is {category['category']}."
            })

        return Response({
            "reply": "No category data available yet."
        })


    # -----------------------------
    # DEFAULT RESPONSE
    # -----------------------------

    else:

        return Response({
            "reply": "I can help with booking tickets, viewing bookings, cancelling tickets, event details, organizers, and platform insights."
        })
    
# email
def test_email(request):

    send_mail(
        subject="Test Email Working ✅",
        message="Your Django email setup is successful!",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=["your_email@gmail.com"],
        fail_silently=False,
    )

    return HttpResponse("Email sent successfully")




@api_view(["POST"])
def host_event(request):

    serializer = HostEventSerializer(data=request.data)

    if serializer.is_valid():

        event = serializer.save()


        # EMAIL TO EVENTEASE TEAM

        send_mail(

            subject="New Host Event Request",

            message=f"""
New hosting request received:

Client: {event.client_name}
Contact Person: {event.contact_person}

Email: {event.email}
Phone: {event.phone}

Event Type: {event.event_type}
Expected Date: {event.expected_date}

Location: {event.location}
Budget: {event.budget}

Description:
{event.description}
""",

            from_email=settings.EMAIL_HOST_USER,

            recipient_list=["eventease.project@gmail.com"]

        )


        # CONFIRMATION EMAIL TO CLIENT

        send_mail(

            subject="Event Request Received - EventEase",

            message=f"""
Hello {event.contact_person},

Thanks for contacting EventEase 🎉

We received your event request successfully.

Our team will contact you soon.

Regards,
EventEase Team
""",

            from_email=settings.EMAIL_HOST_USER,

            recipient_list=[event.email]

        )


        return Response(

            {"message": "Request submitted successfully"},

            status=status.HTTP_201_CREATED

        )


    return Response(serializer.errors)

@api_view(["GET"])
def host_event_list(request):

    events = HostEvent.objects.all().order_by("-created_at")

    serializer = HostEventSerializer(events, many=True)

    return Response(serializer.data)


#notification

@api_view(["GET"])
def host_event_notification_count(request):

    count = HostEvent.objects.filter(status="NEW").count()

    return Response({
        "new_requests": count
    })

@api_view(["GET"])
def host_events(request):

    events = HostEvent.objects.all().order_by("-id")

    serializer = HostEventSerializer(events, many=True)

    return Response(serializer.data)


@api_view(["PUT"])
def contacted_host_event(request, pk):

    try:
        event = HostEvent.objects.get(id=pk)

    except HostEvent.DoesNotExist:

        return Response(
            {"error": "Request not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    event.status = "CONTACTED"

    event.save()

    return Response({
        "message": "Marked as CONTACTED"
    })


@api_view(["PUT"])
def approve_host_event(request, pk):

    try:
        event = HostEvent.objects.get(id=pk)

    except HostEvent.DoesNotExist:

        return Response(
            {"error": "Request not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    event.status = "APPROVED"

    event.save()

    return Response({
        "message": "Marked as APPROVED"
    })

@api_view(['POST'])
def add_wishlist(request):

    user_id = request.data.get("user_id")
    event_id = request.data.get("event_id")

    user = Register.objects.get(id=user_id)
    event = Event.objects.get(id=event_id)

    wishlist, created = Wishlist.objects.get_or_create(
        user=user,
        event=event
    )

    return Response({"message": "Added to wishlist"})

@api_view(['DELETE'])
def remove_wishlist(request, event_id, user_id):

    Wishlist.objects.filter(
        user_id=user_id,
        event_id=event_id
    ).delete()

    return Response({"message": "Removed"})

@api_view(['GET'])
def my_wishlist(request, user_id):

    wishlist = Wishlist.objects.filter(
        user_id=user_id
    ).select_related("event")

    data = [
        {
            "id": item.id,
            "event": {
                "id": item.event.id,
                "title": item.event.title,
                "available_seats": item.event.available_seats
            }
        }
        for item in wishlist
    ]

    return Response(data)



@api_view(['GET'])
def event_reminders(request, user_id):

    today = date.today()

    reminders = []

    wishlist = Wishlist.objects.filter(user_id=user_id)

    for item in wishlist:

        event = item.event

        days_left = (event.date - today).days

        if days_left >= 0 and days_left <= 3:

            reminders.append({

                "title": event.title,
                "event_id": event.id,
                "days_left": days_left

            })

    return Response(reminders)


#recommendation


@api_view(['GET'])
def recommended_events(request, user_id):

    today = date.today()

    booked_categories = Booking.objects.filter(
        user_id=user_id,
        status="Booked"
    ).values_list(
        "event__category",
        flat=True
    )

    wishlist_categories = Wishlist.objects.filter(
        user_id=user_id
    ).values_list(
        "event__category",
        flat=True
    )

    categories = list(set(
        list(booked_categories) +
        list(wishlist_categories)
    ))


    if categories:

        recommended = Event.objects.filter(
            category__in=categories,
            date__gte=today,
            status="Active"
        ).order_by("date")[:6]

    else:

        recommended = Event.objects.filter(
            date__gte=today,
            status="Active"
        ).order_by("date")[:6]


    # fallback if still empty
    if not recommended.exists():

        recommended = Event.objects.filter(
            status="Active"
        ).order_by("-created_at")[:6]


    data = []

    for event in recommended:

        data.append({

            "id": event.id,
            "title": event.title,
            "venue": event.venue,
            "date": event.date,
            "category": event.category,
            "image": event.image.url if event.image else None

        })

    return Response(data)

# popular events
@api_view(['GET'])
def popular_this_week(request):

    today = date.today()
    next_week = today + timedelta(days=7)

    final_events = []


    # STEP 1 → get events this week
    week_events = Event.objects.filter(
        date__range=[today, next_week]
    ).order_by("date")

    final_events.extend(list(week_events))


    # STEP 2 → if less than 4 → add upcoming events
    if len(final_events) < 4:

        remaining = 4 - len(final_events)

        upcoming_events = Event.objects.filter(
            date__gte=today
        ).exclude(
            id__in=[event.id for event in final_events]
        ).order_by("date")[:remaining]

        final_events.extend(list(upcoming_events))


    # STEP 3 → if still less than 4 → add latest events
    if len(final_events) < 4:

        remaining = 4 - len(final_events)

        latest_events = Event.objects.exclude(
            id__in=[event.id for event in final_events]
        ).order_by("-id")[:remaining]

        final_events.extend(list(latest_events))


    data = []

    for event in final_events:

        data.append({

            "id": event.id,
            "title": event.title,
            "venue": event.venue,
            "date": event.date,
            "category": event.category,
            "image": event.image.url if event.image else None

        })


    return Response(data)

#featued events
@api_view(['GET'])
def featured_events(request):

    today = date.today()


    # upcoming events first
    events = Event.objects.filter(
        date__gte=today
    ).order_by("date")[:8]


    # fallback if fewer events exist
    if events.count() < 6:

        extra_events = Event.objects.exclude(
            id__in=[e.id for e in events]
        ).order_by("-id")[:(6 - events.count())]

        events = list(events) + list(extra_events)


    data = []

    for event in events:

        data.append({

            "id": event.id,
            "title": event.title,
            "date": event.date,
            "venue": event.venue,
            "image": event.image.url if event.image else None

        })


    return Response(data)

#upcoming events
@api_view(['GET'])
def upcoming_events(request):

    today = date.today()


    # get upcoming events first
    events = Event.objects.filter(
        date__gte=today
    ).order_by("date")[:6]


    # fallback if less than 4 exist
    if events.count() < 4:

        extra_events = Event.objects.exclude(
            id__in=[e.id for e in events]
        ).order_by("-id")[:(4 - events.count())]

        events = list(events) + list(extra_events)


    data = []

    for event in events:

        data.append({

            "id": event.id,
            "title": event.title,
            "date": event.date,
            "venue": event.venue,
            "image": event.image.url if event.image else None

        })


    return Response(data)

#forgot password
@api_view(['POST'])
def forgot_password(request):

    email = request.data.get("email")

    try:

        user = Register.objects.get(email=email)

        uid = urlsafe_base64_encode(
            force_bytes(user.id)
        )

        reset_link = f"http://localhost:3000/reset-password/{uid}/"

        send_mail(

            "Reset Password",

            f"Click here to reset password:\n{reset_link}",

            "your_email@gmail.com",

            [email]

        )

        return Response({
            "message": "Reset link sent successfully"
        })

    except Register.DoesNotExist:

        return Response({
            "error": "Email not registered"
        })
    
@api_view(['POST'])
def reset_password(request, uid):

    try:

        user_id = urlsafe_base64_decode(uid).decode()

        user = Register.objects.get(id=user_id)

    except:

        return Response({
            "error": "Invalid reset link"
        })


    password = request.data.get("password")

    user.password = password
    user.confirm_password = password

    user.save()

    return Response({
        "message": "Password updated successfully"
    })

@api_view(['POST'])
def subscribe_newsletter(request):

    email = request.data.get("email")

    if NewsletterSubscriber.objects.filter(email=email).exists():

        return Response({

            "message": "Already subscribed"

        })


    NewsletterSubscriber.objects.create(email=email)


    return Response({

        "message": "Subscribed successfully"

    })



@api_view(['POST'])
def admin_register(request):

    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")

    if password != confirm_password:
        return Response({"message": "Passwords do not match"})

    if Register.objects.filter(email=email).exists():
        return Response({"message": "Admin already exists"})

    Register.objects.create(
        username=username,
        email=email,
        password=password,
        confirm_password=confirm_password,
        role="admin"
    )

    return Response({"message": "Admin registered successfully"})


@api_view(['POST'])
def admin_login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    try:
        admin = Register.objects.get(
            email=email,
            password=password,
            role="admin"
        )

        return Response({
            "message": "Admin login successful",
            "admin_id": admin.id,
            "username": admin.username,
            "role": admin.role
        })

    except Register.DoesNotExist:

        return Response({
            "message": "Invalid admin credentials"
        })