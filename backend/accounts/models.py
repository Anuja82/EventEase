from django.db import models

# Create your models here.
class Register(models.Model):
    username=models.CharField(max_length=100,unique=True,null=True)
    email=models.EmailField(unique=True)
    password=models.CharField(max_length=100)
    confirm_password=models.CharField(max_length=100)
    created_at=models.DateTimeField(auto_now_add=True)
    ROLE_CHOICES=(
        ('user','User'),
        ('organizer','Organizer'),
        ('admin','Admin'),
    )
    role=models.CharField(max_length=20,choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True) 
    
    def __str__(self):
        return self.email


class Event(models.Model):

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)

    date = models.DateField()
    time = models.TimeField()

    venue = models.CharField(max_length=200)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_seats = models.IntegerField()
    available_seats = models.IntegerField(blank=True)

    description = models.TextField()

    image = models.ImageField(upload_to="event_images/", null=True, blank=True)

    organizer = models.ForeignKey(
        Register,
        on_delete=models.CASCADE,
        related_name="events"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.available_seats = self.total_seats
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
class AccountDeletionRequest(models.Model):
    user = models.ForeignKey(Register, on_delete=models.CASCADE)
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        default="Pending"
    )

    def __str__(self):
        return f"{self.user.email} - {self.status}"
    
class Booking(models.Model):

    STATUS_CHOICES = [
        ("Booked", "Booked"),
        ("Cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        Register,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    tickets = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Booked"
    )

    booked_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        # Auto calculate total price
        self.total_price = self.tickets * self.event.price

        # Check seat availability
        if not self.pk:  # only on new booking
            if self.tickets > self.event.available_seats:
                raise ValueError("Not enough seats available")

            # Reduce available seats
            self.event.available_seats -= self.tickets
            self.event.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.event.title}"
    

class HostEvent(models.Model):
    STATUS_CHOICES = [
        ("NEW", "New"),
        ("APPROVED", "Approved"),
        ("CONTACTED", "Contacted"),
        ("CONVERTED", "Converted"),
    ]

    client_name = models.CharField(max_length=200)

    contact_person = models.CharField(max_length=200)

    email = models.EmailField()

    phone = models.CharField(max_length=15)

    event_type = models.CharField(max_length=100)

    expected_date = models.DateField()

    location = models.CharField(max_length=255)

    budget = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="NEW"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):

        return self.client_name


class Wishlist(models.Model):

    user = models.ForeignKey(
        Register,
        on_delete=models.CASCADE,
        related_name="wishlist"
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="wishlisted_by"
    )

    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'event']

    def __str__(self):
        return f"{self.user.email} → {self.event.title}"
    

class NewsletterSubscriber(models.Model):

    email = models.EmailField(unique=True)

    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return self.email