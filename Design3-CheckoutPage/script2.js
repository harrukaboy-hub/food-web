document.addEventListener('DOMContentLoaded', function() {
    // Create SVG placeholders for images
    createSVGPlaceholders();
    
    // Initialize quantity selectors
    initQuantitySelectors();
    
    // Initialize delivery option selection
    initDeliveryOptions();
    
    // Initialize payment method selection
    initPaymentMethods();
    
    // Initialize promo code functionality
    initPromoCode();
    
    // Initialize remove item functionality
    initRemoveItems();
    
    // Initialize place order button
    initPlaceOrderButton();
    
    // Initialize order tracking modal
    initTrackingModal();
    
    // Initialize animations
    initAnimations();
});

// Create SVG placeholders for images
function createSVGPlaceholders() {
    const imagePlaceholders = [
        { selector: '.item-image img', color: '#FFE8D8', text: 'Food Item' },
        { selector: '.driver-photo img', color: '#D8F0FF', text: 'Driver' }
    ];
    
    imagePlaceholders.forEach(placeholder => {
        const images = document.querySelectorAll(placeholder.selector);
        images.forEach(img => {
            const svgContent = createSVG(placeholder.color, placeholder.text);
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
        });
    });
}

function createSVG(bgColor, text) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 300 200">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#555" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
}

// Initialize quantity selectors
function initQuantitySelectors() {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    
    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const quantityElement = selector.querySelector('.quantity');
        
        let quantity = parseInt(quantityElement.textContent);
        
        minusBtn.addEventListener('click', function() {
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateOrderSummary();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            quantity++;
            quantityElement.textContent = quantity;
            updateOrderSummary();
        });
    });
}

// Initialize delivery option selection
function initDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('.option-card');
    const deliveryFeeElement = document.querySelector('.breakdown-row:nth-child(2) span:last-child');
    const standardFee = 2.99;
    const expressFee = 4.99;
    
    deliveryOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            deliveryOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update delivery fee
            if (radio.id === 'express') {
                deliveryFeeElement.textContent = `$${expressFee.toFixed(2)}`;
            } else {
                deliveryFeeElement.textContent = `$${standardFee.toFixed(2)}`;
            }
            
            // Update order total
            updateOrderSummary();
        });
    });
}

// Initialize payment method selection
function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-card');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });
}

// Initialize promo code functionality
function initPromoCode() {
    const promoInput = document.querySelector('.promo-code input');
    const applyButton = document.querySelector('.btn-apply');
    const discountElement = document.querySelector('.breakdown-row.discount span:last-child');
    
    applyButton.addEventListener('click', function() {
        const promoCode = promoInput.value.trim().toUpperCase();
        
        if (promoCode === 'WELCOME20') {
            // Apply discount
            discountElement.textContent = '-$2.00';
            showToast('Promo code applied successfully!');
            promoInput.disabled = true;
            applyButton.disabled = true;
            applyButton.textContent = 'Applied';
            applyButton.style.backgroundColor = '#4caf50';
        } else if (promoCode === '') {
            showToast('Please enter a promo code');
        } else {
            showToast('Invalid promo code');
        }
        
        // Update order total
        updateOrderSummary();
    });
}

// Initialize remove item functionality
function initRemoveItems() {
    const removeButtons = document.querySelectorAll('.btn-remove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderItem = this.closest('.order-item');
            const itemName = orderItem.querySelector('h3').textContent;
            
            // Animate removal
            orderItem.style.opacity = '0';
            orderItem.style.height = orderItem.offsetHeight + 'px';
            orderItem.style.overflow = 'hidden';
            
            setTimeout(() => {
                orderItem.style.height = '0';
                orderItem.style.padding = '0';
                orderItem.style.margin = '0';
                
                setTimeout(() => {
                    orderItem.remove();
                    updateOrderSummary();
                    showToast(`${itemName} removed from cart`);
                    
                    // Check if cart is empty
                    const remainingItems = document.querySelectorAll('.order-item');
                    if (remainingItems.length === 0) {
                        const orderItems = document.querySelector('.order-items');
                        const emptyMessage = document.createElement('div');
                        emptyMessage.className = 'empty-cart';
                        emptyMessage.innerHTML = `
                            <i class="fas fa-shopping-cart"></i>
                            <p>Your cart is empty</p>
                            <a href="../Design2-MenuPage/index1.html" class="btn-secondary">Browse Menu</a>
                        `;
                        orderItems.appendChild(emptyMessage);
                        
                        // Add styles for empty cart
                        const style = document.createElement('style');
                        style.textContent = `
                            .empty-cart {
                                text-align: center;
                                padding: 30px 0;
                                color: #999;
                            }
                            .empty-cart i {
                                font-size: 3rem;
                                margin-bottom: 15px;
                            }
                            .empty-cart p {
                                margin-bottom: 20px;
                                font-size: 1.1rem;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }, 300);
            }, 300);
        });
    });
}

// Update order summary
function updateOrderSummary() {
    // Calculate subtotal
    let subtotal = 0;
    const orderItems = document.querySelectorAll('.order-item');
    
    orderItems.forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        subtotal += price * quantity;
    });
    
    // Get delivery fee
    const deliveryFee = parseFloat(document.querySelector('.breakdown-row:nth-child(2) span:last-child').textContent.replace('$', ''));
    
    // Get discount
    const discountText = document.querySelector('.breakdown-row.discount span:last-child').textContent;
    const discount = parseFloat(discountText.replace('-$', '')) || 0;
    
    // Calculate total
    const total = subtotal + deliveryFee - discount;
    
    // Update DOM
    document.querySelector('.breakdown-row:first-child span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.breakdown-row.total span:last-child').textContent = `$${total.toFixed(2)}`;
}

// Initialize place order button
function initPlaceOrderButton() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderPlacedModal = document.getElementById('orderPlacedModal');
    
    placeOrderBtn.addEventListener('click', function() {
        // Show loading state
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        placeOrderBtn.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
            // Show order placed modal
            orderPlacedModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Reset button state
            placeOrderBtn.innerHTML = 'Place Order <i class="fas fa-arrow-right"></i>';
            placeOrderBtn.disabled = false;
        }, 1500);
    });
    
    // Initialize track order button
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    const trackingModal = document.getElementById('trackingModal');
    
    trackOrderBtn.addEventListener('click', function() {
        // Hide order placed modal
        orderPlacedModal.classList.remove('active');
        
        // Show tracking modal
        trackingModal.classList.add('active');
    });
}

// Initialize tracking modal
function initTrackingModal() {
    const closeTrackingBtn = document.getElementById('closeTrackingBtn');
    const trackingModal = document.getElementById('trackingModal');
    
    closeTrackingBtn.addEventListener('click', function() {
        trackingModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close modal when clicking outside the modal content
    trackingModal.addEventListener('click', function(event) {
        if (event.target === trackingModal) {
            trackingModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && trackingModal.classList.contains('active')) {
            trackingModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}

// Show toast notification
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
        
        // Add toast styles
        toast.style.position = 'fixed';
        toast.style.bottom = '100px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#333';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-in-out';
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Initialize animations with Intersection Observer
function initAnimations() {
    const animatedElements = document.querySelectorAll('.checkout-section, .order-item, .option-card, .payment-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        // Set initial styles
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        
        observer.observe(element);
    });
}