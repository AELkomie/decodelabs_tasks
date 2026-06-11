/*
  ════════════════════════════════════════════════════════════════════
  script.js — DigitalCraft · DecodeLabs Project 1
  ════════════════════════════════════════════════════════════════════

  TABLE OF CONTENTS
  ─────────────────
  1.  Wait for DOM to Load
  2.  Hamburger Menu Toggle
  3.  Close Mobile Nav on Link Click
  4.  Header Shadow on Scroll
  5.  Back To Top Button
  6.  Scroll Reveal Animation (IntersectionObserver)
  7.  Skill Bars Animation (IntersectionObserver)
  8.  Subscribe Form Validation

  KEY CONCEPT: The DOM (Document Object Model)
  ─────────────────────────────────────────────
  When the browser loads HTML, it converts it into a tree of objects
  called the DOM. JavaScript can READ and CHANGE this tree.

  Example:
    HTML:       <button id="my-btn">Click me</button>
    JavaScript: document.getElementById('my-btn')  → gives you the button object
                button.textContent = 'Clicked!'     → changes what it says
                button.classList.add('active')       → adds a CSS class
*/


/* ════════════════════════════════════════════════════════════════════
   1. WAIT FOR DOM TO LOAD
   ════════════════════════════════════════════════════════════════════

   Even though our <script> tag is at the bottom of <body>,
   using DOMContentLoaded is a good practice — it ensures ALL
   HTML has been parsed before our code runs.
*/

document.addEventListener('DOMContentLoaded', function () {
  /*
    addEventListener(event, callback)
    - 'DOMContentLoaded' fires when HTML is fully parsed (not waiting for images)
    - The function inside is called a "callback" — it runs when the event fires
  */

  // ── Call all our setup functions ────────────────────────────────
  initHamburger();
  initHeaderScroll();
  initBackToTop();
  initScrollReveal();
  initSkillBars();
  initSubscribeForm();

  /*
    Breaking code into separate functions keeps things organized.
    Each function handles ONE specific feature.
    This is called "separation of concerns."
  */
});


/* ════════════════════════════════════════════════════════════════════
   2. HAMBURGER MENU TOGGLE
   ════════════════════════════════════════════════════════════════════

   Clicking the hamburger button:
   - Toggles the "open" class on both the button and the mobile nav
   - Updates aria-expanded for accessibility (screen readers)
*/

function initHamburger() {

  // Get references to the HTML elements we need
  var burgerBtn = document.getElementById('burger-btn');
  var mobileNav = document.getElementById('mobile-nav');
  /*
    getElementById('id') finds ONE element by its id attribute.
    Returns the element object, or null if not found.
    We store it in a variable so we don't have to search the DOM every time.
  */

  // Guard: if either element doesn't exist, stop here
  if (!burgerBtn || !mobileNav) return;
  /*
    This is called a "guard clause."
    If something is missing, we exit early instead of crashing.
  */

  // Listen for clicks on the hamburger button
  burgerBtn.addEventListener('click', function () {
    /*
      classList.toggle('open') does TWO things:
      - If the element DOESN'T have "open": ADDS it
      - If the element DOES have "open":    REMOVES it
      It also RETURNS true if the class was added, false if removed.
    */
    var isOpen = mobileNav.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    /*
      toggle(class, force) with a second argument:
      force=true  → always ADD the class
      force=false → always REMOVE the class
      Here we sync the burger's state with the nav's state.
    */

    // Update aria-expanded for screen readers
    burgerBtn.setAttribute('aria-expanded', isOpen);
    /*
      setAttribute(name, value) sets an HTML attribute.
      aria-expanded tells screen readers if the controlled element is open.
      It needs to be "true" or "false" as a string (isOpen is boolean, JS converts it).
    */
  });
}


/* ════════════════════════════════════════════════════════════════════
   3. CLOSE MOBILE NAV ON LINK CLICK
   ════════════════════════════════════════════════════════════════════

   When a user taps a link in the mobile nav, we:
   1. Let the browser navigate to the anchor (#section)
   2. Close the mobile nav menu
*/

// This runs after initHamburger because it references the same elements.
// We separate it for clarity.
document.addEventListener('DOMContentLoaded', function () {

  var burgerBtn = document.getElementById('burger-btn');
  var mobileNav = document.getElementById('mobile-nav');

  if (!mobileNav || !burgerBtn) return;

  // querySelectorAll returns a NodeList (like an array) of ALL matching elements
  var mobileLinks = mobileNav.querySelectorAll('a');
  /*
    querySelectorAll(selector) — uses CSS selector syntax.
    mobileNav.querySelectorAll('a') = all <a> tags INSIDE mobileNav.
  */

  // Loop over each link and add a click listener
  mobileLinks.forEach(function (link) {
    /*
      forEach() runs the callback function once for each item in the list.
      "link" is the current item in each iteration.
    */
    link.addEventListener('click', function () {
      // Remove "open" class from both nav and button
      mobileNav.classList.remove('open');
      burgerBtn.classList.remove('open');
      // Update accessibility attribute
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

});


/* ════════════════════════════════════════════════════════════════════
   4. HEADER SHADOW ON SCROLL
   ════════════════════════════════════════════════════════════════════

   When the user scrolls down past 20px, add a shadow to the header.
   When they scroll back to the top, remove it.
   This gives a depth effect showing content "going under" the header.
*/

function initHeaderScroll() {

  var header = document.getElementById('site-header');

  if (!header) return;

  // Listen for scroll events on the whole window
  window.addEventListener('scroll', function () {
    /*
      window.scrollY = how many pixels the user has scrolled vertically.
      If more than 20px, add 'scrolled' class; otherwise remove it.
    */
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
  /*
    { passive: true } is a performance hint.
    It tells the browser "this listener won't call preventDefault()."
    This lets the browser handle the scroll without waiting for JS — smoother.
  */
}


/* ════════════════════════════════════════════════════════════════════
   5. BACK TO TOP BUTTON
   ════════════════════════════════════════════════════════════════════

   Show the button after scrolling down 400px.
   Clicking it smoothly scrolls back to the top.
*/

function initBackToTop() {

  var backTopBtn = document.getElementById('back-top');

  if (!backTopBtn) return;

  // Show/hide based on scroll position
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backTopBtn.classList.add('visible');
    } else {
      backTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll to top when clicked
  backTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top:      0,
      behavior: 'smooth'   /* animated scroll, not instant jump */
    });
  });
}


/* ════════════════════════════════════════════════════════════════════
   6. SCROLL REVEAL ANIMATION
   ════════════════════════════════════════════════════════════════════

   Elements with class "reveal" start invisible (opacity:0, translateY).
   As they enter the viewport, we add "in-view" which triggers the
   CSS transition to make them fade and slide into view.

   We use IntersectionObserver — a modern browser API that watches
   elements and tells us when they enter/leave the viewport.
   It's much better than the old approach (listening to scroll events
   and doing math), because:
   - No performance hit — browser handles the detection efficiently
   - No scroll event needed — cleaner code
*/

function initScrollReveal() {

  // Get all elements with the "reveal" class
  var revealElements = document.querySelectorAll('.reveal');

  // Create an IntersectionObserver
  var observer = new IntersectionObserver(function (entries) {
    /*
      entries = array of observed elements that changed visibility.
      Each time an observed element enters or exits the viewport,
      this callback fires with an updated list of entries.
    */
    entries.forEach(function (entry) {
      /*
        entry.isIntersecting = true  → element is now VISIBLE in viewport
        entry.isIntersecting = false → element has left the viewport
      */
      if (entry.isIntersecting) {
        // Add the class that triggers the CSS animation
        entry.target.classList.add('in-view');
        /*
          entry.target = the actual HTML element being observed.
          Once it's visible, we stop observing it (no need to watch anymore).
        */
        observer.unobserve(entry.target);
        /*
          unobserve() stops watching a specific element.
          Without this, the observer would keep running even after the
          animation is done — wasted computation.
        */
      }
    });
  }, {
    threshold: 0.12
    /*
      threshold: how much of the element must be visible to trigger.
      0.12 = 12% of the element must be in the viewport.
      0 = as soon as 1 pixel is visible
      1 = element must be fully visible
    */
  });

  // Start observing each reveal element
  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}


/* ════════════════════════════════════════════════════════════════════
   7. SKILL BARS ANIMATION
   ════════════════════════════════════════════════════════════════════

   Each .skill-fill bar has a data-width attribute (e.g. data-width="90").
   When the bar enters the viewport, we set its CSS width to that value.
   The CSS transition then animates it from 0% to the target width.

   data-* attributes are custom HTML attributes for storing data.
   Read in JS with: element.dataset.width  (converts data-width → dataset.width)
*/

function initSkillBars() {

  var skillFills = document.querySelectorAll('.skill-fill');

  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;

        // Read the target width from the data attribute
        var targetWidth = bar.dataset.width;
        /*
          bar.dataset = object containing all data-* attributes.
          bar.dataset.width reads the value of data-width="90" → "90" (string).
        */

        // Set the CSS width property directly via inline style
        bar.style.width = targetWidth + '%';
        /*
          bar.style.width = "90%" triggers the CSS transition:
          transition: width 1.2s cubic-bezier(.4,0,.2,1);
          The bar smoothly grows from 0 to 90%.
        */

        skillObserver.unobserve(bar);   // stop watching after it animates
      }
    });
  }, {
    threshold: 0.3   /* trigger when 30% of the bar row is visible */
  });

  skillFills.forEach(function (bar) {
    skillObserver.observe(bar);
  });
}


/* ════════════════════════════════════════════════════════════════════
   8. SUBSCRIBE FORM VALIDATION
   ════════════════════════════════════════════════════════════════════

   We validate the email input when the Subscribe button is clicked.
   - Empty input  → show warning message
   - Invalid email → show warning message
   - Valid email  → show success message, clear input

   We DON'T use a <form> tag to avoid page reload.
   All logic is handled here in JavaScript.
*/

function initSubscribeForm() {

  var subscribeBtn = document.getElementById('subscribe-btn');
  var emailInput   = document.getElementById('email-input');
  var formMsg      = document.getElementById('form-msg');

  if (!subscribeBtn || !emailInput || !formMsg) return;

  // ── CLICK EVENT on Subscribe button ─────────────────────────────
  subscribeBtn.addEventListener('click', function () {
    validateAndSubmit();
  });

  // ── ENTER KEY on the email input ────────────────────────────────
  emailInput.addEventListener('keydown', function (event) {
    /*
      event = the keyboard event object. Contains info about which key was pressed.
      event.key = the name of the key pressed ('Enter', 'Escape', 'a', etc.)
    */
    if (event.key === 'Enter') {
      validateAndSubmit();
    }
  });

  // ── VALIDATION FUNCTION ─────────────────────────────────────────
  function validateAndSubmit() {

    // Get the current value, remove leading/trailing whitespace
    var value = emailInput.value.trim();
    /*
      .value = the current text inside the input
      .trim() = removes spaces from start and end. "  hello@x.com  " → "hello@x.com"
    */

    // Case 1: Empty input
    if (value === '') {
      showMessage('⚠ Please enter your email address.', '#ffb347');
      return;   /* return stops the function here, prevents further checks */
    }

    // Case 2: Invalid email format — check with a Regular Expression
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /*
      A REGULAR EXPRESSION (regex) is a pattern for matching text.
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/  means:
      ^          = start of string
      [^\s@]+    = one or more characters that are NOT whitespace or @
      @          = a literal @ symbol
      [^\s@]+    = one or more characters that are NOT whitespace or @
      \.         = a literal dot (. in regex means "any character", so we escape it)
      [^\s@]+    = one or more characters that are NOT whitespace or @
      $          = end of string

      This matches: something@something.something
      Not a perfect email validator but good for basic checks.
    */

    var isValidEmail = emailRegex.test(value);
    /*
      regex.test(string) returns true if the string matches the pattern.
    */

    if (!isValidEmail) {
      showMessage("⚠ That doesn't look like a valid email address.", '#ffb347');
      return;
    }

    // Case 3: Valid email — success!
    showMessage('✓ You\'re in! Watch your inbox.', '#90e8b0');
    /*
      \' is an escape character — lets us use an apostrophe inside a string
      that is wrapped in single quotes.
    */

    // Clear the input after successful submission
    emailInput.value = '';
  }

  // ── HELPER: show a message and auto-hide after 4 seconds ────────
  function showMessage(text, color) {
    /*
      Parameters: text = message string, color = hex color string.
      These are LOCAL to this function (function scope).
    */

    formMsg.textContent = text;
    /*
      .textContent sets the text content of an element.
      Safer than .innerHTML because it doesn't parse HTML —
      protects against XSS (cross-site scripting) attacks.
    */

    formMsg.style.color = color;     /* set text color inline */
    formMsg.classList.add('visible');  /* triggers CSS opacity: 1 */

    // Auto-hide the message after 4000ms (4 seconds)
    setTimeout(function () {
      formMsg.classList.remove('visible');
      /*
        setTimeout(callback, delay) runs the callback ONCE after "delay" milliseconds.
        1000ms = 1 second, so 4000ms = 4 seconds.
      */
    }, 4000);
  }

}

/*
  ════════════════════════════════════════════════════════════════════
  SUMMARY: What JavaScript Does On This Page
  ════════════════════════════════════════════════════════════════════

  1. HAMBURGER MENU
     → Listens for click on #burger-btn
     → Toggles .open class on nav and button
     → Updates aria-expanded for accessibility
     → Closes when any link inside is clicked

  2. HEADER SCROLL EFFECT
     → Listens for window scroll event
     → Adds .scrolled class after 20px → CSS shows box-shadow

  3. BACK TO TOP
     → Shows #back-top button after 400px scroll
     → Clicking it calls window.scrollTo({ top: 0 })

  4. SCROLL REVEAL
     → IntersectionObserver watches all .reveal elements
     → When 12% visible → adds .in-view → CSS transition plays

  5. SKILL BARS
     → IntersectionObserver watches all .skill-fill elements
     → When 30% visible → reads data-width → sets style.width → CSS animates

  6. FORM VALIDATION
     → Validates email on button click or Enter key
     → Shows colored message via .form-msg element
     → Auto-hides message after 4 seconds

  ════════════════════════════════════════════════════════════════════
*/