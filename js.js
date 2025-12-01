let dobleback = false;
const tiempoEspera = 1500;

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
        let animacionFrameId = null; 

        function actualizarContenido() {
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
        function moverAIndice(nuevoIndice, conTransicion = true) {
            indiceActual = nuevoIndice;
            const desplazamiento = -indiceActual * 100;
            carruselImagenes.style.transition = conTransicion ? 'transform 0.25s ease-in-out' : 'none';
            carruselImagenes.style.transform = `translateX(${desplazamiento}%)`;
            
            actualizarContenido();
        }

        function animarArrastre() {
            if (!arrastrando) {
                animacionFrameId = null;
                return;
            }
            carruselImagenes.style.transition = 'none';
            const ancho = carruselImagenes.offsetWidth;
            const posicionInicialPorcentaje = -indiceActual * 100;
            const desplazamientoPorcentaje = (desplazamientoX / ancho) * 100;
            carruselImagenes.style.transform = `translateX(${posicionInicialPorcentaje + desplazamientoPorcentaje}%)`;
            animacionFrameId = requestAnimationFrame(animarArrastre);
        }

        carruselImagenes.addEventListener('touchstart', (e) => {
            inicioX = e.touches[0].clientX;
            arrastrando = true;
            if (!animacionFrameId) {
                animacionFrameId = requestAnimationFrame(animarArrastre);
            }
        });
        carruselImagenes.addEventListener('touchmove', (e) => {
            if (!arrastrando) return;
            const movimientoX = e.touches[0].clientX;
            desplazamientoX = movimientoX - inicioX; 
        });
        carruselImagenes.addEventListener('touchend', () => {
            if (!arrastrando) return;
            cancelAnimationFrame(animacionFrameId);
            animacionFrameId = null;
            arrastrando = false;

            let nuevoIndice = indiceActual;
            if (desplazamientoX < -umbralSwipe) { 
                nuevoIndice = Math.min(indiceActual + 1, numImagenes - 1); 
            } else if (desplazamientoX > umbralSwipe) { 
                nuevoIndice = Math.max(indiceActual - 1, 0); 
            }
            desplazamientoX = 0;
            moverAIndice(nuevoIndice); 
        });
        puntos.forEach(punto => {
            punto.addEventListener('click', () => {
                const index = parseInt(punto.dataset.index);
                moverAIndice(index); 
            });
        });
        moverAIndice(indiceActual, false);
    });

    
    window.history.pushState({salida:true}, null, window.location.pathname);
    window.addEventListener('popstate', (e) => {
        if(dobleback){
            return;
        }
        dobleback = true;
        alert("Presiona de nuevo y te vas pa la calle.");
        window.history.pushState({salida:true}, null, window.location.pathname);
        setTimeout(() => {
            dobleback = false;
        }, tiempoEspera);
    })
});