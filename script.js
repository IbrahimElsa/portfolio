import { gsap } from 'gsap';

// Get the navbar
var navbar = document.getElementById("navbar");

// Animate the navbar
gsap.from(navbar, {duration: 1, y: -100, ease: 'power2.out'});

// Get the modal
var modal = document.getElementById("contactModal");

// Get the button that opens the modal
var btn = document.getElementById("contactLink");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  gsap.to(modal, {autoAlpha: 1, scale: 1, duration: 1});
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  gsap.to(modal, {autoAlpha: 0, scale: 0.8, duration: 1});
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    gsap.to(modal, {autoAlpha: 0, scale: 0.8, duration: 1});
  }
}