adocument.addEventListener('DOMContentLoaded', function() {
    // Create SVG placeholders for images
    createSVGPlaceholders();
    
    // Initialize menu item click events
    initMenuItemEvents();
    
    // Initialize category buttons
    initCategoryButtons();
    
    // Initialize modal functionality
    initModal();
    
    // Initialize quantity selector
    initQuantitySelector();
    
    // Initialize favorite buttons
    initFavoriteButtons();
    
    // Initialize animations
    initAnimations();
});

// Create SVG placeholders for images
function createSVGPlaceholders() {
    const imagePlaceholders = [
        { selector: '.restaurant-banner img', color: '#FFD8D8', text: 'Restaurant Banner' },
        { selector: '.restaurant-logo img', color: '#FFE8D8', text: 'Logo' },
        { selector: '.offer-image img', color: '#FFEFD8', text: 'Special Offer' },
        { selector: '.item-image img', color: '#D8F0FF', text: 'Food Item' },
        { selector: '.item-image-large img', color: '#D8FFDB', text: 'Food Item Large' }
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

// Initialize menu item click events
function initMenuItemEvents() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            openItemDetailModal();
        });
    });
}

// Initialize category buttons
function initCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically filter menu items based on category
            // For demo purposes, we'll just log the category
            console.log('Category selected:', this.textContent.trim());
        });
    });
}

// Initialize modal functionality
function initModal() {
    const modal = document.getElementById('itemDetailModal');
    const closeButton = modal.querySelector('.modal-close');
    
    // Close modal when clicking the close button
    closeButton.addEventListener('click', function() {
        closeItemDetailModal();
    });
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeItemDetailModal();
        }
    });
    
    // Prevent scrolling when modal is open
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeItemDetailModal();
        }
    });
}

function openItemDetailModal() {
    const modal = document.getElementById('itemDetailModal');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    modal.classList.add('active');
}

function closeItemDetailModal() {
    const modal = document.getElementById('itemDetailModal');
    document.body.style.overflow = ''; // Restore scrolling
    modal.classList.remove('active');
}

// Initialize quantity selector
function initQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityElement = document.querySelector('.quantity');
    const totalPriceElement = document.querySelector('.total-price .price');
    const basePrice = 8.99; // Base price from the HTML
    
    let quantity = 1;
    
    minusBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent modal from closing
        if (quantity > 1) {
            quantity--;
            updateQuantityAndPrice();
        }
    });
    
    plusBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent modal from closing
        quantity++;
        updateQuantityAndPrice();
    });
    
    function updateQuantityAndPrice() {
        quantityElement.textContent = quantity;
        const totalPrice = (basePrice * quantity).toFixed(2);
        totalPriceElement.textContent = `$${totalPrice}`;
    }
}

// Initialize favorite buttons
function initFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent parent click events
            
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                // Change to solid heart (favorited)
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
            } else {
                // Change to regular heart (unfavorited)
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
            }
        });
    });
}

// Initialize animations with Intersection Observer
function initAnimations() {
    const animatedElements = document.querySelectorAll('.menu-item, .offer-card');
    
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

// Add to cart functionality
document.querySelectorAll('.btn-add, .btn-add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent parent click events
        
        // Get item details
        const itemName = this.closest('.menu-item') ? 
            this.closest('.menu-item').querySelector('h3').textContent : 
            document.querySelector('.item-details-full h2').textContent;
            
        const itemPrice = this.closest('.menu-item') ? 
            this.closest('.menu-item').querySelector('.item-price').textContent : 
            document.querySelector('.total-price .price').textContent;
        
        // Update cart count and total with actual item price
        updateCartSummary(itemName, itemPrice);
        
        // Show a toast notification
        showToast(`Added ${itemName} to cart`);
        
        // Close modal if adding from modal
        if (this.classList.contains('btn-add-to-cart')) {
            closeItemDetailModal();
        }
    });
});

// Add remove from cart functionality
function addRemoveItemFunctionality() {
    // Create a remove button for each cart item
    const cartItemsContainer = document.createElement('div');
    cartItemsContainer.className = 'cart-items-container';
    cartItemsContainer.style.display = 'none';
    document.querySelector('.cart-summary').appendChild(cartItemsContainer);
    
    // Toggle cart items display when clicking on cart summary
    document.querySelector('.cart-summary').addEventListener('click', function() {
        cartItemsContainer.style.display = cartItemsContainer.style.display === 'none' ? 'block' : 'none';
        
        // Update cart items list
        updateCartItemsList();
    });
    
    function updateCartItemsList() {
        // Clear current items
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-cart-message';
            emptyMessage.textContent = 'Your cart is empty';
            cartItemsContainer.appendChild(emptyMessage);
            return;
        }
        
        // Add each item with a remove button
        cartItems.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">RS ${item.price}</span>
                <button class="btn-remove" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Add remove button functionality
        document.querySelectorAll('.btn-remove').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                const removedItem = cartItems[index];
                
                // Remove item and update cart
                updateCartSummary(removedItem.name, `RS ${removedItem.price}`, true);
                
                // Show toast notification
                showToast(`Removed ${removedItem.name} from cart`);
                
                // Update the cart items list
                updateCartItemsList();
            });
        });
    }
}

// Initialize remove item functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add this to the existing DOMContentLoaded event
    addRemoveItemFunctionality();
});

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
        toast.style.bottom = '80px';
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

// Cart items array to store added items
let cartItems = [];

// Update cart summary with dynamic price calculation
function updateCartSummary(itemName, itemPrice, isRemoving = false) {
    const itemCountElement = document.querySelector('.cart-items .item-count');
    const itemTotalElement = document.querySelector('.cart-items .item-total');
    const cartCountElement = document.querySelector('.cart-count');
    
    // Extract numeric price value from the price string (e.g., "RS 150" -> 150)
    const priceValue = parseInt(itemPrice.replace(/[^0-9]/g, ''));
    
    if (!isRemoving) {
        // Add item to cart
        cartItems.push({
            name: itemName,
            price: priceValue
        });
    } else {
        // Remove item from cart if it exists
        const index = cartItems.findIndex(item => item.name === itemName);
        if (index !== -1) {
            cartItems.splice(index, 1);
        }
    }
    
    // Update count
    const itemCount = cartItems.length;
    itemCountElement.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    
    // Calculate total price from all items in cart
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    itemTotalElement.textContent = `RS ${totalPrice}`;
    
    // Update cart icon count
    cartCountElement.textContent = itemCount;
    
    return { itemCount, totalPrice };
}