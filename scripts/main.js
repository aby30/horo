function expandMenu() {
  var hasClass = $('.header__navInner').hasClass("expandedMenu");
  if (hasClass) {
    $('.header__navInner').removeClass("expandedMenu");
    $('.header__navHam').removeClass("hamOpen");
  }
  else {
    $('.header__navInner').addClass("expandedMenu");
    $('.header__navHam').addClass("hamOpen");
  }
}

// function submitForm() {
//   //- document.getElementById("userQueryFooterForm").submit();
//   // $('.footer__formSubmit > button')
//   $('#userQueryFooterForm').submit(function(e) {
//      e.preventDefault();
//      $.ajax({
//           type: 'POST',
//           crossDomain: true,
//           // headers: {Access-Control-Allow-Origin: *},
//           url: 'https://docs.google.com/forms/d/e/1FAIpQLSecezfx9ymt_kqPONFebEmUysz70YeqIpAnz_UCcvL9uKDhpw/formResponse',
//           data: $(this).serialize(),
//           success: function(data) {
//             console.log(data);
//             $('.footer__submitSuccess').show();
//           }
//      });
//
//   });
// }


$(document).ready(function(){

  $(".header__navLink").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 600, function(){

        // // Add hash (#) to URL when done scrolling (default click behavior)
        // window.location.hash = hash;
      });
    } // End if
  });
});
