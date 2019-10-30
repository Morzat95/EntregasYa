// function loadLayout() {
//     $('#nav-placeholder').load('nav.html');
// }

$(window).on("load", function () { // TODO: Tengo el mismo código en client_v1.js
    console.log('Loading Navbar...');
    $('#nav-placeholder').load('nav.html');
});