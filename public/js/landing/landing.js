/**
 * Created by benjamintanz on 06.09.15.
 */
$( document ).ready(function() {

  /** darken out top nac von scroll */
  $(window).scroll(function() {
    var position = $(window).scrollTop();

    if (position >= 500) {
      $('nav').addClass('navbar-dark');
    } else {
      $('nav').removeClass('navbar-dark');
    }
  });

  /** scroll down on click of carousel button */
  $("#header-btn").click(function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $("#features").offset().top
    }, 2000);
  });

  /** scroll down on click of calc overview */
  $("#calcs-link").click(function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $("#calcs").offset().top
    }, 2000);
  });



});