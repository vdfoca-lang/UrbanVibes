
        // Controlar velocidad personalizada
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            new bootstrap.Carousel(carousel, {
                interval: 4000, // 4 segundos
                wrap: true,
                pause: 'hover'
            });
        });