document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap dropdowns with custom configuration
    const initDropdowns = () => {
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        return dropdownElementList.map(dropdownToggleEl => {
            return new bootstrap.Dropdown(dropdownToggleEl, {
                popperConfig: (defaultBsPopperConfig) => ({
                    ...defaultBsPopperConfig,
                    placement: 'bottom-start',
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 12],
                            },
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                padding: 16,
                            },
                        },
                    ],
                }),
            });
        });
    };

    const dropdowns = initDropdowns();

    // Enhanced dropdown toggle for mobile
    const setupMobileDropdowns = () => {
        const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > .nav-link');
        
        dropdownToggles.forEach(toggle => {
            // Remove previous event listeners to avoid duplicates
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            newToggle.addEventListener('click', function(e) {
                // Only handle if mobile view or in offcanvas
                if (window.innerWidth < 992 || this.closest('.offcanvas')) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const parentLi = this.closest('.nav-item.dropdown');
                    const dropdownMenu = this.nextElementSibling;
                    
                    if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                        // Close other open dropdowns
                        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                            if (menu !== dropdownMenu) {
                                menu.classList.remove('show');
                                const parent = menu.previousElementSibling;
                                const icon = parent ? parent.querySelector('.fa-angle-down') : null;
                                if (icon) icon.style.transform = '';
                            }
                        });
                        
                        // Toggle current dropdown
                        const isOpening = !dropdownMenu.classList.contains('show');
                        dropdownMenu.classList.toggle('show', isOpening);
                        
                        // Animate the dropdown
                        if (isOpening) {
                            dropdownMenu.style.display = 'block';
                            const height = dropdownMenu.scrollHeight;
                            dropdownMenu.style.height = '0';
                            dropdownMenu.style.overflow = 'hidden';
                            
                            setTimeout(() => {
                                dropdownMenu.style.height = `${height}px`;
                                dropdownMenu.style.transition = 'height 0.3s ease';
                            }, 10);
                        } else {
                            dropdownMenu.style.height = '0';
                            dropdownMenu.style.overflow = 'hidden';
                            dropdownMenu.style.transition = 'height 0.2s ease';
                            
                            // Reset after animation
                            setTimeout(() => {
                                dropdownMenu.style.display = '';
                                dropdownMenu.style.height = '';
                                dropdownMenu.style.overflow = '';
                                dropdownMenu.style.transition = '';
                            }, 200);
                        }
                        
                        // Toggle the arrow icon
                        const icon = this.querySelector('.fa-angle-down');
                        if (icon) {
                            icon.style.transform = isOpening ? 'rotate(180deg)' : '';
                        }
                    }
                }
            });
        });
    };

    // Handle clicks outside dropdowns
    const handleOutsideClick = (e) => {
        const isDropdown = e.target.closest('.dropdown') || 
                         e.target.matches('.dropdown, .dropdown *');
        
        if (!isDropdown) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
                menu.previousElementSibling?.querySelector('.fa-angle-down')?.style.setProperty('transform', '');
            });
        }
    };

    // Handle keyboard navigation
    const handleKeyboardNav = (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
                menu.previousElementSibling?.querySelector('.fa-angle-down')?.style.setProperty('transform', '');
            });
        } else if (e.key === 'Tab') {
            const focused = document.activeElement;
            if (focused && !focused.closest('.dropdown-menu') && !focused.matches('.dropdown-toggle')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                    menu.previousElementSibling?.querySelector('.fa-angle-down')?.style.setProperty('transform', '');
                });
            }
        }
    };

    // Handle window resize
    const handleResize = () => {
        if (window.innerWidth >= 992) {
            // Reset mobile-specific styles on desktop
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = '';
                menu.style.height = '';
                menu.style.overflow = '';
                menu.style.transition = '';
            });
        }
        // Re-initialize dropdowns after resize
        dropdowns.forEach(dropdown => dropdown.dispose());
        initDropdowns();
    };

    // Initialize
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyboardNav);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleKeyboardNav);
        window.removeEventListener('resize', handleResize);
    };
});
