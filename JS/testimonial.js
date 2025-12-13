document.addEventListener('DOMContentLoaded', function() {
            // Initialize carousel
            const myCarousel = new bootstrap.Carousel(document.getElementById('testimonialCarousel'), {
                interval: 5000,
                touch: true,
                wrap: true
            });
            
            // Get all testimonial slides and indicators
            const carouselItems = document.querySelectorAll('.testimonial-main');
            const carouselIndicators = document.querySelectorAll('.carousel-indicators [data-bs-target]');
            
            // Show first testimonial by default
            if (carouselItems.length > 0) {
                carouselItems[0].classList.add('active');
            }
            
            // Update active testimonial when carousel slides
            document.getElementById('testimonialCarousel').addEventListener('slid.bs.carousel', function (e) {
                const activeIndex = Array.from(this.querySelectorAll('.carousel-item')).indexOf(e.relatedTarget);
                
                // Hide all testimonials
                document.querySelectorAll('.testimonial-main').forEach(item => {
                    item.style.display = 'none';
                    item.classList.remove('active');
                });
                
                // Show active testimonial with animation
                const activeTestimonial = document.querySelector(`.testimonial-main[data-index="${activeIndex}"]`);
                if (activeTestimonial) {
                    activeTestimonial.style.display = 'block';
                    // Force reflow to enable transition
                    void activeTestimonial.offsetWidth;
                    activeTestimonial.classList.add('active');
                }
            });
            
            // Pause carousel on hover
            const carousel = document.getElementById('testimonialCarousel');
            carousel.addEventListener('mouseenter', function() {
                this.carousel = bootstrap.Carousel.getInstance(this);
                this.carousel.pause();
            });
            
            carousel.addEventListener('mouseleave', function() {
                this.carousel.cycle();
            });
            
            // Click on indicators to switch testimonials
            carouselIndicators.forEach((indicator, index) => {
                indicator.addEventListener('click', function() {
                    // Update active testimonial
                    document.querySelectorAll('.testimonial-main').forEach(item => {
                        item.style.display = 'none';
                        item.classList.remove('active');
                    });
                    
                    const testimonialToShow = document.querySelector(`.testimonial-main[data-index="${index}"]`);
                    if (testimonialToShow) {
                        testimonialToShow.style.display = 'block';
                        // Force reflow to enable transition
                        void testimonialToShow.offsetWidth;
                        testimonialToShow.classList.add('active');
                    }
                });
            });
            
            // Add smooth hover effect to carousel controls
            const carouselControls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
            carouselControls.forEach(control => {
                control.style.transition = 'all 0.3s ease';
                
                control.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-50%) scale(1.1)';
                    this.style.background = 'rgba(255, 255, 255, 1)';
                });
                
                control.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(-50%)';
                    this.style.background = 'rgba(255, 255, 255, 0.9)';
                });
            });
        });