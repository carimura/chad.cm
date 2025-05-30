document.addEventListener('DOMContentLoaded', function() {
    const img = document.getElementById('profile-img');
    if (!img) return; // Exit if image not found
    
    const link = img.parentElement;
    const cartoonSrc = img.getAttribute('data-cartoon');
    const realSrc = img.getAttribute('data-real');
    
    // Desktop hover effects
    img.addEventListener('mouseenter', function() {
        this.src = realSrc;
        link.href = realSrc;
    });
    
    img.addEventListener('mouseleave', function() {
        this.src = cartoonSrc;
        link.href = cartoonSrc;
    });
    
    // Mobile touch support
    let touchTimeout;
    img.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.src = realSrc;
        link.href = realSrc;
        
        // Revert after 2 seconds
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            this.src = cartoonSrc;
            link.href = cartoonSrc;
        }, 2000);
    });
}); 