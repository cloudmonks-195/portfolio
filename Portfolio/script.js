// toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

//scroll sections
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let header = document.querySelector('header');
let footer = document.querySelector('footer');

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.onscroll = debounce(() => {
    // Active section detection
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            // Active navbar links
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector(`header nav a[href*="${id}"]`).classList.add('active');
            });
            // Active sections for animation on scroll
            sec.classList.add('show-animate');
        } else {
            sec.classList.remove('show-animate');
        }
    });

    // Sticky header
    header.classList.toggle('sticky', window.scrollY > 100);

    // Remove toggle icon and navbar when clicking navbar links (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    // Animation footer on scroll
    if (footer) {
        footer.classList.toggle('show-animate', 
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
        );
    }
}, 100); // 100ms debounce time

// Scroll Reveal Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add show class when element comes into view
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            // Remove show class when element goes out of view
            entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.2, // 20% of the item must be visible
    rootMargin: '-50px' // Adds a bit of offset to trigger slightly before the element comes into view
});

// Get all education content elements
document.addEventListener('DOMContentLoaded', () => {
    const educationContents = document.querySelectorAll('.education-content');
    educationContents.forEach((content) => {
        observer.observe(content);
    });
});

// Skills section scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    const skillsContents = document.querySelectorAll('.skills-content');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Get all progress bars in this skills content
                const progressBars = entry.target.querySelectorAll('.progress .bar span');
                progressBars.forEach(bar => {
                    // Get the percentage from the text
                    const percentText = bar.closest('.progress').querySelector('h3 span').textContent;
                    const percent = parseInt(percentText);
                    
                    // Set the width directly
                    bar.style.width = percent + '%';
                });
            } else {
                entry.target.classList.remove('show');
                
                // Reset progress bars when out of view
                const progressBars = entry.target.querySelectorAll('.progress .bar span');
                progressBars.forEach(bar => {
                    bar.style.width = '0';
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px'
    });

    skillsContents.forEach((content) => {
        skillsObserver.observe(content);
    });
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const response = await fetch('https://portfolio-backend-z8ub.onrender.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            alert('Message sent successfully!');
            e.target.reset();
            
            // Add success class to input fields
            document.querySelectorAll('.input-field').forEach(field => {
                field.classList.add('success');
            });
        } else {
            throw new Error(data.error || 'Something went wrong!');
        }
    } catch (error) {
        alert(error.message);
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});