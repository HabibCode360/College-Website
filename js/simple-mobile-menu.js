// Simple Mobile Menu Script
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuToggle.querySelector('i').classList.remove('fa-bars');
                mobileMenuToggle.querySelector('i').classList.add('fa-times');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) {
                mobileMenu.classList.add('hidden');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }
});