const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function prepararLinks() {
  const links = INVITACION_CONFIG.links || {};

  $$('[data-link]').forEach((elemento) => {
    const nombreLink = elemento.dataset.link;
    const url = links[nombreLink];

    if (url && url.trim() !== '') {
      elemento.href = url;
    } else {
      elemento.href = '#';
      elemento.addEventListener('click', (event) => {
        event.preventDefault();
        mostrarAviso('Este link todavía está pendiente. Agrégalo en config.js');
      });
    }
  });
}

function iniciarContador() {
  const fechaObjetivo = new Date(INVITACION_CONFIG.fechaFiesta).getTime();
  const dias = $('#dias');
  const horas = $('#horas');
  const minutos = $('#minutos');
  const segundos = $('#segundos');

  function actualizar() {
    const ahora = new Date().getTime();
    const diferencia = fechaObjetivo - ahora;

    if (diferencia <= 0) {
      dias.textContent = '000';
      horas.textContent = '00';
      minutos.textContent = '00';
      segundos.textContent = '00';
      return;
    }

    const d = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const h = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diferencia / (1000 * 60)) % 60);
    const s = Math.floor((diferencia / 1000) % 60);

    dias.textContent = String(d).padStart(3, '0');
    horas.textContent = String(h).padStart(2, '0');
    minutos.textContent = String(m).padStart(2, '0');
    segundos.textContent = String(s).padStart(2, '0');
  }

  actualizar();
  setInterval(actualizar, 1000);
}

function iniciarAnimacionesScroll() {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
      }
    });
  }, { threshold: 0.25 });

  $$('.reveal').forEach((elemento) => observador.observe(elemento));
}

function iniciarAcordeones() {
  $$('.accordion-btn').forEach((boton) => {
    boton.addEventListener('click', () => {
      const acordeon = boton.closest('.accordion');
      const yaEstaAbierto = acordeon.classList.contains('open');

      $$('.accordion').forEach((item) => {
        item.classList.remove('open');
        const botonInterno = item.querySelector('.accordion-btn');
        if (botonInterno) botonInterno.setAttribute('aria-expanded', 'false');
      });

      if (!yaEstaAbierto) {
        acordeon.classList.add('open');
        boton.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

let temporizadorAviso;
function mostrarAviso(texto) {
  const aviso = $('#toast');
  aviso.textContent = texto;
  aviso.classList.add('show');

  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => {
    aviso.classList.remove('show');
  }, 3000);
}

prepararLinks();
iniciarContador();
iniciarAnimacionesScroll();
iniciarAcordeones();
