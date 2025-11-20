document.addEventListener('DOMContentLoaded', () => {
    const carruselItems = document.querySelectorAll('.carrusel-item');
    carruselItems.forEach(carrusel => {
        const carruselImagenes = carrusel.querySelector('.carrusel-imagenes');
        const puntos = carrusel.querySelectorAll('.punto');
        const reactsDiv = carrusel.querySelector('.reacts');
        const infoDiv = carrusel.querySelector('.info');
        const numImagenes = carruselImagenes.querySelectorAll('.img').length;
        let indiceActual = 0;
        let inicioX = 0; 
        let desplazamientoX = 0;
        let arrastrando = false; 
        const umbralSwipe = 50; 
        function actualizarCarrusel(transicion = true) {
            const desplazamiento = -indiceActual * 100;
            if (transicion) {
                carruselImagenes.style.transition = 'transform 0.25s ease-in-out';
            } else {
                carruselImagenes.style.transition = 'none';
            }
            carruselImagenes.style.transform = `translateX(${desplazamiento}%)`;
            puntos.forEach((punto, index) => {
                punto.classList.toggle('activo', index === indiceActual);
            });
            const imagenes = carruselImagenes.querySelectorAll('.img');
            const imagenActual = imagenes[indiceActual];
            if (imagenActual && reactsDiv && infoDiv) {
                const nuevoReacts = imagenActual.dataset.reacts;
                const nuevoInfo = imagenActual.dataset.info;
                reactsDiv.textContent = nuevoReacts || 'Sin reacciones'; 
                infoDiv.innerHTML = `<p>${nuevoInfo || 'Sin información adicional.'}</p>`; 
            }
        }
        carruselImagenes.addEventListener('touchstart', (e) => {
            inicioX = e.touches[0].clientX;
            arrastrando = true;
            carruselImagenes.style.transition = 'none'; 
        });
        carruselImagenes.addEventListener('touchmove', (e) => {
            if (!arrastrando) return;
            const movimientoX = e.touches[0].clientX;
            desplazamientoX = movimientoX - inicioX; 
            const posicionActual = -indiceActual * 100;
            const desplazamientoPorcentaje = (desplazamientoX / carruselImagenes.offsetWidth) * 100;
            carruselImagenes.style.transform = `translateX(${posicionActual + desplazamientoPorcentaje}%)`;
        });
        carruselImagenes.addEventListener('touchend', () => {
            if (!arrastrando) return;
            arrastrando = false;
            if (desplazamientoX < -umbralSwipe) { 
                indiceActual = Math.min(indiceActual + 1, numImagenes - 1); 
            } else if (desplazamientoX > umbralSwipe) { 
                indiceActual = Math.max(indiceActual - 1, 0); 
            }
            desplazamientoX = 0;
            actualizarCarrusel(); 
        });
        puntos.forEach(punto => {
            punto.addEventListener('click', () => {
                const index = parseInt(punto.dataset.index);
                indiceActual = index;
                actualizarCarrusel();
            });
        });

        actualizarCarrusel();
    });
});