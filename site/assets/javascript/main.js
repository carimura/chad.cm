// Image modal functionality and blog components
document.addEventListener('DOMContentLoaded', function() {
    initImageModal();
    initSpoilerText();
});

function initImageModal() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <img src="${src}" alt="${alt}" class="modal-image">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking the X button
    modal.querySelector('.close-button').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.querySelector('.image-modal')) {
            const existingModal = document.querySelector('.image-modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
            }
        }
    });
}

// Spoiler text functionality
function initSpoilerText() {
    const spoilers = document.querySelectorAll('.spoiler');
    spoilers.forEach(spoiler => {
        spoiler.addEventListener('click', function() {
            this.classList.add('revealed');
        });
    });
}