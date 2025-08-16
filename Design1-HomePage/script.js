// JavaScript for Food Runs Home Page

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Email validation for Find Food button
    const findFoodBtn = document.getElementById('find-food-btn');
    const emailInput = document.getElementById('email-input');
    
    if (findFoodBtn && emailInput) {
        findFoodBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simple email validation
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email === '') {
                alert('Please enter your email address');
                return;
            } else if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // If validation passes, redirect to the menu page
            window.location.href = '../Design2-MenuPage/index1.html';
        });
    }
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href');
            
            // If it's a page section, scroll to it
            if(targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                if(targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Create SVG placeholders for images
    createSVGPlaceholders();
    
    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe feature and restaurant cards
    featureCards.forEach(card => observer.observe(card));
    restaurantCards.forEach(card => observer.observe(card));
});

// Function to create SVG placeholders for images
function createSVGPlaceholders() {
    // Phone mockup SVG
    const phoneMockupImg = document.querySelector('.phone-mockup img');
    if(phoneMockupImg) {
        const svgContent = `
        <svg width="300" height="600" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="600" rx="30" fill="#333" />
            <rect x="15" y="15" width="270" height="570" rx="20" fill="#FF4500" />
            <circle cx="150" cy="550" r="25" fill="#333" stroke="#555" stroke-width="2" />
            <rect x="140" y="30" width="20" height="5" rx="2.5" fill="#333" />
            <text x="150" y="300" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Food Runs App</text>
        </svg>
        `;
        phoneMockupImg.outerHTML = svgContent;
    }
    
    // Restaurant images SVGs
    const restaurantImgs = document.querySelectorAll('.restaurant-image img');
    const colors = ['#FFE4B5', '#E6E6FA', '#F0FFF0'];
    const foodIcons = [
        'M12,3L4,21H20L12,3M12,7L16,16H8L12,7Z', // Pizza icon path
        'M2,16H22V18H2V16M2,10H22V12H2V10M2,4H22V6H2V4Z', // Burger icon path
        'M12,3L4,9V21H20V9L12,3M12,7.5L14,9V10H10V9L12,7.5M10,15V12H14V15H10Z' // Sushi icon path
    ];
    
    restaurantImgs.forEach((img, index) => {
        const color = colors[index % colors.length];
        const iconPath = foodIcons[index % foodIcons.length];
        
        const svgContent = `
        <svg width="100%" height="100%" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="${color}" />
            <svg x="125" y="75" width="50" height="50" viewBox="0 0 24 24">
                <path d="${iconPath}" fill="#FF4500" />
            </svg>
        </svg>
        `;
        img.outerHTML = svgContent;
    });
    
    // App screens SVG
    const appScreensImg = document.querySelector('.app-image img');
    if(appScreensImg) {
        const svgContent = `
        <svg width="500" height="400" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(100, 50)">
                <rect width="120" height="240" rx="20" fill="#333" />
                <rect x="10" y="10" width="100" height="220" rx="10" fill="#FF4500" />
                <text x="60" y="120" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Food Runs</text>
            </g>
            <g transform="translate(250, 100)">
                <rect width="120" height="240" rx="20" fill="#333" />
                <rect x="10" y="10" width="100" height="220" rx="10" fill="#FF4500" />
                <text x="60" y="120" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Food Runs</text>
            </g>
        </svg>
        `;
        appScreensImg.outerHTML = svgContent;
    }
}

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .feature-card, .restaurant-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .feature-card.animate, .restaurant-card.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card:nth-child(2) {
        transition-delay: 0.2s;
    }
    
    .feature-card:nth-child(3) {
        transition-delay: 0.4s;
    }
    
    .restaurant-card:nth-child(2) {
        transition-delay: 0.2s;
    }
    
    .restaurant-card:nth-child(3) {
        transition-delay: 0.4s;
    }
`;
document.head.appendChild(style);