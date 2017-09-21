document.addEventListener("DOMContentLoaded", function(event) {
  var burger = document.getElementById("burger-button");
  burger.addEventListener("click", function(){
      //Move everything over to make the menu visible.
      var mobileMenu = document.getElementById("mobile-slide-out");
      mobileMenu.className += " opened";

      //Create div to cover all the content when the menu opens.
      var closeMenuDiv = document.createElement("div");
      closeMenuDiv.className = "close-menu-div";
      closeMenuDiv.id= "close-menu-div";
      var navHeader = document.getElementById("header");
      navHeader.insertBefore(closeMenuDiv, mobileMenu);

      //Create clickable action on the div to close the menu and set everything back to normal.
      closeMenuDiv.addEventListener("click", function(){
          mobileMenu.className = mobileMenu.className.replace(" opened", "");

          closeMenuDiv.remove();
      });
  });
});
