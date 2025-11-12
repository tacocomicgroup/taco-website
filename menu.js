// Menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    console.log('Menu elements found:', {
        menuToggle: !!menuToggle,
        menuClose: !!menuClose,
        sideMenu: !!sideMenu,
        menuOverlay: !!menuOverlay
    });

    if (menuToggle && menuClose && sideMenu && menuOverlay) {
        console.log('Setting up menu event listeners');
        
        // Open menu
        menuToggle.addEventListener('click', function(e) {
            console.log('Menu toggle clicked');
            e.preventDefault();
            e.stopPropagation();
            sideMenu.classList.add('active');
            menuOverlay.classList.add('active');
        });

        // Close menu
        const closeMenu = () => {
            console.log('Closing menu');
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        };

        menuClose.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);

        // Close menu when a link is clicked
        document.querySelectorAll('.menu-nav a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Optional: Also close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    } else {
        console.error('Menu elements not found');
    }
});
