// Scroll animation for Exclusive Offerings section
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the element is in view
    });

    cards.forEach(card => {
        observer.observe(card);
    });
});

// Optional: Add drag-to-scroll functionality for the carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.testimonials-carousel');
    const track = document.querySelector('.carousel-track');
    let isDragging = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.animationPlayState = 'paused'; // Pause animation while dragging
    });

    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
        track.style.animationPlayState = 'running'; // Resume animation
    });

    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        track.style.animationPlayState = 'running'; // Resume animation
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed
        track.scrollLeft = scrollLeft - walk;
    });

    // Optional: Add touch support for mobile
    carousel.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.animationPlayState = 'paused';
    });

    carousel.addEventListener('touchend', () => {
        isDragging = false;
        track.style.animationPlayState = 'running';
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        track.scrollLeft = scrollLeft - walk;
    });
});

// booking.js
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const nextButtons = document.querySelectorAll('.next-button');
    const prevButtons = document.querySelectorAll('.prev-button');
    const homeButton = document.querySelector('.home-button');
    let currentStep = 1;

    // Store user selections
    const bookingData = {
        service: '',
        price: 0,
        duration: 0,
        barber: '',
        date: '',
        time: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        paymentMethod: 'credit-card',
        bookingCode: '',
        bookingPin: ''
    };

    // Step 1: Select a Service
    const serviceCards = document.querySelectorAll('.service-card');
    const step1NextButton = document.querySelector('#step-1 .next-button');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            bookingData.service = card.dataset.service;
            bookingData.price = parseInt(card.dataset.price);
            bookingData.duration = parseInt(card.dataset.duration);
            step1NextButton.disabled = false;
        });
    });

    // Step 2: Select a Barber
    const barberCards = document.querySelectorAll('.barber-card');
    const step2NextButton = document.querySelector('#step-2 .next-button');
    barberCards.forEach(card => {
        card.addEventListener('click', () => {
            barberCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            bookingData.barber = card.dataset.barber;
            step2NextButton.disabled = false;
        });
    });

    // Step 3: Select Date & Time
    const datePicker = document.querySelector('#date-picker');
    const timeSlots = document.querySelectorAll('.time-slot');
    const step3NextButton = document.querySelector('#step-3 .next-button');
    let dateSelected = false;
    let timeSelected = false;

    datePicker.addEventListener('change', () => {
        bookingData.date = datePicker.value;
        dateSelected = true;
        step3NextButton.disabled = !(dateSelected && timeSelected);
    });

    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            bookingData.time = slot.dataset.time;
            timeSelected = true;
            step3NextButton.disabled = !(dateSelected && timeSelected);
        });
    });

    // Step 4: Your Information
    
    const userInfoForm = document.querySelector('#user-info-form');
    const step4NextButton = document.querySelector('#step-4 .next-button');
    const phoneInput = document.querySelector('#phone');

    function validatePhoneNumber(value) {
        const phoneRegex = /^\d*$/;
        return phoneRegex.test(value);
    }

    function showPhoneError(show) {
        const errorElement = document.getElementById('phone-error');
        if (show) {
            if (!errorElement) {
                const error = document.createElement('p');
                error.id = 'phone-error';
                error.className = 'error-message';
                error.textContent = 'Please enter a valid phone number (digits only).';
                phoneInput.parentElement.appendChild(error);
            }
            phoneInput.classList.add('error');
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            phoneInput.classList.remove('error');
        }
    }

    function validateUserInfoForm() {
        const firstName = document.querySelector('#first-name').value.trim();
        const lastName = document.querySelector('#last-name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const phone = document.querySelector('#phone').value.trim();
        const isPhoneValid = validatePhoneNumber(phone);
        const isValid = userInfoForm.checkValidity() && firstName && lastName && email && phone && isPhoneValid;

        bookingData.firstName = firstName;
        bookingData.lastName = lastName;
        bookingData.email = email;
        bookingData.phone = phone;
        bookingData.specialRequests = document.querySelector('#special-requests').value;

        showPhoneError(phone && !isPhoneValid);
        step4NextButton.disabled = !isValid;

        return isValid;
    }

    validateUserInfoForm();

    userInfoForm.addEventListener('input', validateUserInfoForm);

    // Step 5: Review Your Appointment
    function updateSummary() {
        document.querySelector('#summary-service').textContent = `${bookingData.service} - $${bookingData.price}`;
        document.querySelector('#summary-barber').textContent = bookingData.barber;
        document.querySelector('#summary-date').textContent = new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        document.querySelector('#summary-time').textContent = bookingData.time;
        document.querySelector('#summary-name').textContent = `${bookingData.firstName} ${bookingData.lastName}`;
        document.querySelector('#summary-email').textContent = bookingData.email;
        document.querySelector('#summary-phone').textContent = bookingData.phone;
        document.querySelector('#summary-total').textContent = `$${bookingData.price}`;
        document.querySelector('#payment-total').textContent = `$${bookingData.price}`;
        document.querySelector('#pay-amount').textContent = `$${bookingData.price}`;
    }

    // Step 6: Payment
    const paymentMethods = document.querySelectorAll('.payment-method');
    const creditCardForm = document.querySelector('#credit-card-form');
    const mobileMoneyForm = document.querySelector('#mobile-money-form');
    const payButton = document.querySelector('.pay-button');

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            bookingData.paymentMethod = method.dataset.method;
            if (bookingData.paymentMethod === 'credit-card') {
                creditCardForm.style.display = 'block';
                mobileMoneyForm.style.display = 'none';
            } else {
                creditCardForm.style.display = 'none';
                mobileMoneyForm.style.display = 'block';
            }
        });
    });

    // Generate Booking Code and PIN
    function generateBookingCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ELITE';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    function generateBookingPin() {
        return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
    }

    // Update Confirmation Step
    function updateConfirmation() {
        document.querySelector('#booking-code').textContent = bookingData.bookingCode;
        document.querySelector('#booking-pin').textContent = bookingData.bookingPin;
        document.querySelector('#confirm-service').textContent = `${bookingData.service} - $${bookingData.price}`;
        document.querySelector('#confirm-barber').textContent = bookingData.barber;
        document.querySelector('#confirm-date').textContent = new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        document.querySelector('#confirm-time').textContent = bookingData.time;
        document.querySelector('#confirm-name').textContent = `${bookingData.firstName} ${bookingData.lastName}`;
        document.querySelector('#confirm-total').textContent = `$${bookingData.price}`;
    }

    payButton.addEventListener('click', () => {
        // Simulate payment processing
        bookingData.bookingCode = generateBookingCode();
        bookingData.bookingPin = generateBookingPin();
        currentStep = 7;
        updateStep();
        updateConfirmation();
    });

    // Navigation between steps
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep === 4) {
                updateSummary();
            }
            if (currentStep < 7) {
                currentStep++;
                updateStep();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStep();
            }
        });
    });

    function updateStep() {
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) <= currentStep) {
                step.classList.add('active');
            }
        });
        stepContents.forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`#step-${currentStep}`).classList.add('active');
    }
});