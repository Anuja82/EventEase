from rest_framework import serializers
from .models import Event
from .models import Booking
from .models import Register,AccountDeletionRequest
from .models import HostEvent
from rest_framework import serializers
from .models import Wishlist


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ["organizer", "available_seats"]




class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Register
        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_active",
            "created_at"
        ]

class OrganizerSerializer(serializers.ModelSerializer):
    deletion_requested = serializers.SerializerMethodField()
    is_approved = serializers.SerializerMethodField()

    class Meta:
        model = Register
        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "is_approved",
            "deletion_requested"
        ]

    def get_deletion_requested(self, obj):
        request = AccountDeletionRequest.objects.filter(
            user=obj, status="Pending"
        ).first()

        if request:
            return request.id
        return None

    def get_is_approved(self, obj):
        return obj.is_active   
    
class AdminEventSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source="organizer.username")
    is_approved = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"

    def get_is_approved(self, obj):
        return obj.status == "Active"

class AdminBookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    event_title = serializers.CharField(source="event.title", read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"

class HostEventSerializer(serializers.ModelSerializer):

    class Meta:

        model = HostEvent

        fields = "__all__"

class WishlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wishlist
        fields = "__all__"