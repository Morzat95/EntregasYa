$(window).on("load", function () {
    console.log('Loading Navbar...');
    $('#nav-placeholder').load('nav.html');         // Cargamos la barra de navegación
    $('#footer-placeholder').load('footer.html');   // Cargamos el pie de página
});