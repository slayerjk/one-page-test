/*global $, jQuery*/


$(document).ready(function () {
  'use strict';

  /*event.preventDefault() gor IE9(event.returnValue = false)*/
  $.fn.eventPreventDefaultSafe = function () {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  };
  /*-------------------------------------------------------*/
  /*Mobile menu behaviour*/
  $(window).resize(function () {
    var w = $(window).width();
    if (w < 768) {
      $('.main-nav__menu-toggle').show();
      if (w < 768 && $('.main-nav__list').hide()) {
        $('.main-nav__menu-toggle').removeClass('main-nav__menu-toggle--close');
        $('.main-nav__list').hide();
      } else if (w < 768 && $('.main-nav__list').show()) {
        $('.main-nav__menu-toggle').addClass('main-nav__menu-toggle--close');
        $('.main-nav__list').show();
      }
    } else if (w >= 768) {
      $('.main-nav__list').show();
      $('.main-nav__menu-toggle').hide();
    }
  });

  $('.main-nav__menu-toggle').on('click', function (event) {
    event.preventDefault();

    $('.main-nav__menu-toggle').toggleClass('main-nav__menu-toggle--close');
    $('.main-nav__list').slideToggle('slow');
  });

});
