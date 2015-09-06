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
});