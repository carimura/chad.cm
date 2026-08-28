// Image modal functionality and blog components
document.addEventListener('DOMContentLoaded', function() {
    initImageModal();
    initSpoilerText();
    initCategoryFilter();
});

function initImageModal() {
    const images = document.querySelectorAll('img:not(.video-thumb img)');

    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openImageModal(this.dataset.full || this.src, this.alt);
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

// Writing page category filter
function initCategoryFilter() {
    const filter = document.querySelector('.category-filter');
    if (!filter) return;

    const buttons = Array.from(filter.querySelectorAll('button'));
    const posts = Array.from(document.querySelectorAll('#writing article[data-category]'));
    const empty = document.getElementById('category-empty');
    const slug = category => category.toLowerCase().replace(/\s+/g, '-');

    function apply(category) {
        let shown = 0;
        buttons.forEach(button => button.classList.toggle('active', button.dataset.category === category));
        posts.forEach(post => {
            const match = category === 'all' || post.dataset.category === category;
            post.hidden = !match;
            if (match) shown++;
        });
        if (empty) empty.hidden = shown > 0;
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            apply(button.dataset.category);
            history.replaceState(null, '', button.dataset.category === 'all' ? location.pathname : '#' + slug(button.dataset.category));
        });
    });

    const fromHash = buttons.find(button => slug(button.dataset.category) === location.hash.slice(1));
    apply(fromHash ? fromHash.dataset.category : 'all');
}