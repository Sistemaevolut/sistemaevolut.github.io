// Sistema Evolut · sistemaevolut.com
// Lo poco que se mueve en la web: el menú del móvil, la cuenta de lo que cuesta repetir y el selector de sectores.
// Sin cookies ni nada guardado en el navegador.
(function () {
  "use strict";

  // ---------- Cabecera: sombra al bajar y menú del móvil ----------
  var cabecera = document.getElementById("cabecera");
  if (cabecera) {
    var boton = cabecera.querySelector(".boton-menu");
    var menu = document.getElementById("menu");

    var sombra = function () { cabecera.classList.toggle("con-sombra", window.scrollY > 8); };
    sombra();
    window.addEventListener("scroll", sombra, { passive: true });

    var abrir = function (si) {
      cabecera.classList.toggle("abierta", si);
      boton.setAttribute("aria-expanded", si ? "true" : "false");
      boton.setAttribute("aria-label", si ? "Cerrar el menú" : "Abrir el menú");
    };
    if (boton && menu) {
      boton.addEventListener("click", function () { abrir(!cabecera.classList.contains("abierta")); });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) abrir(false); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && cabecera.classList.contains("abierta")) { abrir(false); boton.focus(); }
      });
    }
  }

  // ---------- La cuenta: personas × horas × coste × 48 semanas ----------
  var miles = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var campos = {
    personas: document.getElementById("c-personas"),
    horas: document.getElementById("c-horas"),
    coste: document.getElementById("c-coste")
  };
  if (campos.personas && campos.horas && campos.coste) {
    var aproximado = function (valor) {
      var redondo = Math.max(1, Math.round(valor));
      return { n: redondo, antes: valor < redondo ? "casi " : (valor > redondo ? "más de " : "") };
    };
    // A qué equivale: semanas de una persona a jornada completa (40 h) o, si pasa del año (48 × 40 h), personas.
    var equivalencia = function (horas) {
      if (horas >= 1920) {
        var p = aproximado(horas / 1920);
        return "el trabajo de " + p.antes + (p.n === 1 ? "una persona" : p.n + " personas") +
          " a jornada completa durante todo el año";
      }
      var s = aproximado(horas / 40);
      return s.antes + (s.n === 1 ? "una semana" : s.n + " semanas") + " de trabajo de una persona";
    };
    var calcular = function () {
      var p = +campos.personas.value, h = +campos.horas.value, c = +campos.coste.value;
      var horasAnyo = p * h * 48;
      document.getElementById("o-personas").textContent = p;
      document.getElementById("o-horas").textContent = h + " h";
      document.getElementById("o-coste").textContent = c + " €";
      document.getElementById("r-euros").textContent = miles(horasAnyo * c) + " €";
      document.getElementById("r-horas").textContent = miles(horasAnyo) + " horas";
      document.getElementById("r-semanas").textContent = equivalencia(horasAnyo);
    };
    Object.keys(campos).forEach(function (k) { campos[k].addEventListener("input", calcular); });
    calcular();
  }

  // ---------- Para quién: una ficha a la vez ----------
  var botones = Array.prototype.slice.call(document.querySelectorAll("[data-selector] button"));
  if (botones.length) {
    var fichas = botones.map(function (b) { return document.getElementById(b.getAttribute("aria-controls")); });
    var mostrar = function (elegido, mover) {
      botones.forEach(function (b, i) {
        var si = b === elegido;
        b.setAttribute("aria-pressed", si ? "true" : "false");
        if (fichas[i]) fichas[i].hidden = !si;
      });
      var ficha = document.getElementById(elegido.getAttribute("aria-controls"));
      // En el móvil la ficha queda debajo de los botones: se acerca si no se ve.
      if (mover && ficha && ficha.getBoundingClientRect().top > window.innerHeight * 0.75) {
        ficha.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    botones.forEach(function (b) { b.addEventListener("click", function () { mostrar(b, true); }); });
    mostrar(botones.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0] || botones[0], false);
  }

  // ---------- El correo para pedir la visita, con lo que conviene contar ----------
  var correo = document.getElementById("boton-correo");
  if (correo) {
    var cuerpo = [
      "Hola, Adrian:",
      "",
      "Me gustaría pedir la primera visita.",
      "",
      "Empresa:",
      "Pueblo:",
      "Teléfono:",
      "",
      "Lo que me gustaría quitarme de encima:",
      "",
      ""
    ].join("\n");
    correo.href = "mailto:info@sistemaevolut.com?subject=" + encodeURIComponent("Primera visita") +
      "&body=" + encodeURIComponent(cuerpo);
  }

  var anyo = document.getElementById("anyo");
  if (anyo) anyo.textContent = new Date().getFullYear();
})();
