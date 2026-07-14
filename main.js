let lenis;

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  initLenis();
  initLocalTime();
  initPreloader();
  initCustomCursor();
  initNavigation();
  initTextSplitting();
  initScrollReveals();
  initMagneticElements();
  initServicesHover();
  initContactForm();
  initCard3DTilt();
  initBentoSpotlights();
  initModernTechStack();
  initAmbientCanvas();
  initHorizontalScroll();
  initJourneyTimeline();
  initMobileTouchInteractions();
  initBlogFilters();
  initBlogSpotlights();
  initBlogReader();
});

/* ==========================================================================
   0. LENIS SMOOTH SCROLL INITIALIZATION
   ========================================================================== */
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Synchronize ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* ==========================================================================
   1. LOCAL TIME WIDGET
   ========================================================================== */
function initLocalTime() {
  const timeValue = document.getElementById("current-time");
  const dashboardTime = document.getElementById("dashboard-time");
  if (!timeValue && !dashboardTime) return;

  function updateClock() {
    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = now.toLocaleTimeString('en-US', options);
    if (timeValue) timeValue.textContent = timeStr;
    if (dashboardTime) dashboardTime.textContent = timeStr;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. PRELOADER & COUNTER LOGIC
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("preloader-counter");
  const wordEl = document.getElementById("preloader-word");
  if (!preloader || !counter) return;

  const greetings = ["HELLO", "KONNICHIWA", "BONJOUR", "DESIGN", "DEVELOP", "YOGESH"];

  let count = 0;
  const duration = 2200; // 2.2 seconds loader
  const interval = 20; // tick rate
  const step = 100 / (duration / interval);

  const timer = setInterval(() => {
    count += step;
    if (count >= 100) {
      count = 100;
      clearInterval(timer);
      finishLoading();
    }

    // Format counter to 3 digits (e.g. 008, 042, 100)
    const displayCount = Math.floor(count).toString().padStart(3, "0");
    counter.textContent = displayCount;

    // Word transition index calculation
    if (wordEl) {
      const wordIndex = Math.min(Math.floor((count / 100) * greetings.length), greetings.length - 1);
      const currentWord = greetings[wordIndex];
      if (wordEl.textContent !== currentWord) {
        anime({
          targets: wordEl,
          translateY: [15, 0],
          opacity: [0, 1],
          duration: 350,
          easing: "easeOutCubic"
        });
        wordEl.textContent = currentWord;
      }
    }
  }, interval);

  function finishLoading() {
    // Fade out preloader content elements
    anime({
      targets: ".preloader-content",
      opacity: 0,
      translateY: -30,
      duration: 600,
      easing: "easeOutQuad",
      complete: () => {
        // Slide open panel upward
        anime({
          targets: ".preloader-panel",
          translateY: "-100%",
          duration: 1200,
          easing: "cubicBezier(0.85, 0, 0.15, 1)",
          complete: () => {
            preloader.style.display = "none";
            // Start main page cinematic entrance
            startEntranceAnimation();
          }
        });
      }
    });
  }
}

/* ==========================================================================
   3. CINEMATIC ENTRANCE ANIMATION
   ========================================================================== */
function startEntranceAnimation() {
  // Reveal Header elements
  anime({
    targets: [".header-logo", "#header-status", "#header-nav-elements"],
    translateY: [-20, 0],
    opacity: [0, 1],
    duration: 1000,
    delay: anime.stagger(100),
    easing: "easeOutQuart"
  });

  // Check if we are on the main portfolio page (has hero section)
  const isMainPage = document.querySelector(".hero-overlap") !== null;

  if (isMainPage) {
    // 1. Reveal Background Massive Text (scale & fade in)
    anime({
      targets: ".hero-bg-text",
      scale: [0.88, 1],
      opacity: [0, 0.95],
      duration: 1500,
      easing: "easeOutExpo"
    });

    // 2. Reveal Foreground Portrait (slide up & fade in)
    anime({
      targets: ".hero-fg-img",
      translateY: [80, 0],
      opacity: [0, 1],
      duration: 1400,
      delay: 200,
      easing: "cubicBezier(0.16, 1, 0.3, 1)"
    });

    // 3. Staggered reveal for details: Badge, Desc, Action Button
    anime({
      targets: [".hero-badge-text", ".hero-description", ".hero-action-btn"],
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(120, { start: 600 }),
      easing: "easeOutCubic"
    });
  }
}

/* ==========================================================================
   4. TEXT SPLITTING HELPER
   ========================================================================== */
function initTextSplitting() {
  // About text splitting (into words for scroll revealing)
  const revealTexts = document.querySelectorAll(".reveal-text");
  revealTexts.forEach(textEl => {
    // Sanitize whitespaces to avoid blank word spans and collapsed sentences
    const text = textEl.textContent.replace(/\s+/g, ' ').trim();
    const words = text.split(" ");
    textEl.innerHTML = "";

    words.forEach(word => {
      const span = document.createElement("span");
      span.className = "reveal-word";
      span.innerHTML = word;
      textEl.appendChild(span);
    });
  });
}

/* ==========================================================================
   5. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const dot = cursor.querySelector(".cursor-dot");
  const circle = cursor.querySelector(".cursor-circle");
  const cursorText = document.getElementById("cursor-text");

  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;
  let dotX = 0;
  let dotY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp (interpolation) for outer circle trailing effect
  function updateCursor() {
    // Lerp circle position
    circleX += (mouseX - circleX) * 0.12;
    circleY += (mouseY - circleY) * 0.12;

    // Lerp dot position (faster follow)
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;

    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    if (cursorText) {
      cursorText.style.left = `${circleX}px`;
      cursorText.style.top = `${circleY}px`;
    }

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Hover states
  const interactables = document.querySelectorAll("a, button, .nav-toggle, [data-cursor-theme]");
  interactables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hovering");

      const theme = el.getAttribute("data-cursor-theme");
      if (theme) {
        document.body.classList.add("cursor-has-text");
        cursorText.textContent = theme.toUpperCase();
      }
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hovering");
      document.body.classList.remove("cursor-has-text");
      cursorText.textContent = "";
    });
  });

  // Show/Hide cursor when mouse leaves document
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = 0;
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = 1;
  });
}

/* ==========================================================================
   6. MAGNETIC HOVER EFFECT
   ========================================================================== */
function initMagneticElements() {
  const magneticItems = document.querySelectorAll(".magnetic-item");

  // Skip on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  magneticItems.forEach(item => {
    let position = null;

    item.addEventListener("mouseenter", () => {
      position = item.getBoundingClientRect();
    });

    item.addEventListener("mousemove", function (e) {
      if (!position) {
        position = item.getBoundingClientRect();
      }
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;

      // Pull element toward cursor (coefficient determines strength)
      item.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;

      // If it's the scroll indicator button, pull its circle slightly differently
      const circle = item.querySelector(".scroll-btn-circle");
      if (circle) {
        circle.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0)`;
      }
    });

    item.addEventListener("mouseleave", function () {
      position = null;
      // Return to base position smoothly
      item.style.transform = "translate3d(0px, 0px, 0px)";

      const circle = item.querySelector(".scroll-btn-circle");
      if (circle) {
        circle.style.transform = "translate3d(0px, 0px, 0px)";
      }
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE NAVIGATION OVERLAY
   ========================================================================== */
function initNavigation() {
  const menuBtn = document.getElementById("menu-btn");
  const navOverlay = document.getElementById("nav-overlay");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.getElementById("main-header");
  const navContainer = document.querySelector(".nav-container");

  if (!menuBtn || !navOverlay) return;

  // Toggle scrolling indicator for responsive menu
  if (navContainer) {
    let scrollTimeout;
    navContainer.addEventListener("scroll", () => {
      navContainer.classList.add("is-scrolling");
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        navContainer.classList.remove("is-scrolling");
      }, 800);
    }, { passive: true });
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.classList.toggle("burger-open");
    navOverlay.classList.toggle("active");

    if (isOpen) {
      // Disable scrolling via Lenis
      if (lenis) lenis.stop();
      document.body.classList.add("menu-open");

      // Stagger nav links slide up
      anime({
        targets: ".nav-link",
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(100, { start: 400 }),
        easing: "cubicBezier(0.16, 1, 0.3, 1)"
      });

      // Fade in social links
      anime({
        targets: ".nav-info-col",
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: anime.stagger(100, { start: 700 }),
        easing: "easeOutQuad"
      });
    } else {
      // Re-enable scrolling via Lenis
      if (lenis) lenis.start();
      document.body.classList.remove("menu-open");

      // Slide nav links down
      anime({
        targets: ".nav-link",
        translateY: [0, 100],
        opacity: [1, 0],
        duration: 600,
        easing: "easeInQuad"
      });
    }
  });

  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("burger-open");
      navOverlay.classList.remove("active");
      document.body.classList.remove("menu-open");
      if (lenis) lenis.start();
    });
  });

  // Smooth scroll handler for all internal hash links
  const allHashLinks = document.querySelectorAll('a[href^="#"]');
  allHashLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;

      if (lenis) {
        lenis.scrollTo(targetEl, {
          offset: -headerHeight,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        const targetOffset = targetId === "#hero" ? 0 : targetEl.offsetTop - headerHeight;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header background highlight on scroll via Lenis or fallback window scroll
  if (lenis) {
    lenis.on('scroll', (e) => {
      if (e.scroll > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  } else {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }
}

/* ==========================================================================
   8. SCROLL REVEALS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
  // Reveal sections
  const sections = document.querySelectorAll(".section");

  // Hide timeline items and education cards immediately to prevent layout shift before animate
  const timelineItems = document.querySelectorAll(".timeline-item");
  const educationCards = document.querySelectorAll(".education-card");
  timelineItems.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
  });
  educationCards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");

        // If it's the about section, trigger word stagger highlight
        if (entry.target.id === "about") {
          revealAboutWords(entry.target);
        }

        // If it's the resume section, trigger timeline and education staggers once
        if (entry.target.id === "resume" && !entry.target.classList.contains("revealed-resume")) {
          entry.target.classList.add("revealed-resume");
          revealResumeElements(entry.target);
        }
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach(section => {
    section.classList.add("reveal-section");
    sectionObserver.observe(section);
  });

  // Reveal About Text word-by-word function
  function revealAboutWords(aboutSection) {
    const words = aboutSection.querySelectorAll(".reveal-word");
    anime({
      targets: words,
      opacity: [0.15, 1],
      translateY: [10, 0],
      duration: 800,
      delay: anime.stagger(25),
      easing: "easeOutQuad"
    });
  }

  // Reveal Resume timeline & education card function
  function revealResumeElements(resumeSection) {
    const items = resumeSection.querySelectorAll(".timeline-item, .education-card");
    anime({
      targets: items,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: anime.stagger(150),
      easing: "cubicBezier(0.16, 1, 0.3, 1)"
    });
  }

  // Project cards entry animation
  const projects = document.querySelectorAll(".project-card");
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 1000,
          easing: "cubicBezier(0.16, 1, 0.3, 1)"
        });
        projectObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  projects.forEach(project => {
    project.style.opacity = "0";
    projectObserver.observe(project);
  });
}

/* ==========================================================================
   9. SERVICES HOVER IMAGE LOGIC
   ========================================================================== */
function initServicesHover() {
  const serviceRows = document.querySelectorAll(".services-row, .other-project-row");
  if (serviceRows.length === 0) return;

  // Create floating element inside body
  const hoverContainer = document.createElement("div");
  hoverContainer.className = "services-hover-image-container";
  const hoverImg = document.createElement("img");
  hoverImg.className = "services-hover-img";
  hoverImg.alt = "Service preview image";
  hoverContainer.appendChild(hoverImg);
  document.body.appendChild(hoverContainer);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp follow for the services preview image
  function updateHoverPosition() {
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;

    hoverContainer.style.left = `${targetX + 30}px`; // offset to right of cursor
    hoverContainer.style.top = `${targetY}px`;

    requestAnimationFrame(updateHoverPosition);
  }
  updateHoverPosition();

  // Hover behaviors
  serviceRows.forEach(row => {
    row.addEventListener("mouseenter", () => {
      const imgSrc = row.getAttribute("data-service-img");
      if (imgSrc) {
        hoverImg.src = imgSrc;
        hoverContainer.style.opacity = 1;
        hoverContainer.style.transform = "scale(1) translate(0%, -50%)";
      }
    });

    row.addEventListener("mouseleave", () => {
      hoverContainer.style.opacity = 0;
      hoverContainer.style.transform = "scale(0.8) translate(0%, -50%)";
    });
  });
}

/* ==========================================================================
   10. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("portfolio-contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("form-submit-btn");
  const submitText = submitBtn.querySelector(".submit-btn-text");
  const submitCircle = submitBtn.querySelector(".submit-btn-circle");
  const inputs = form.querySelectorAll(".form-input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Prepare form payload (MUST be done before disabling inputs, otherwise values are empty/null)
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    // Disable all inputs and button to prevent double-submission
    inputs.forEach(input => input.disabled = true);
    submitBtn.disabled = true;

    // Set sending text
    submitText.textContent = "SENDING...";

    // Animate submit circle expanding and button color change
    anime({
      targets: submitCircle,
      scale: [0, 2.5],
      duration: 800,
      easing: "cubicBezier(0.16, 1, 0.3, 1)"
    });

    submitBtn.style.color = "#ffffff";
    submitBtn.style.borderColor = "var(--color-accent)";

    // Send actual POST request to the API endpoint
    fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Transition to success state
      submitText.textContent = "MESSAGE SENT!";
      submitBtn.style.borderColor = "#00e676";
      submitCircle.style.backgroundColor = "#00e676";

      // Reset form fields
      form.reset();

      // Wait 3 seconds, then restore original button state
      setTimeout(() => {
        anime({
          targets: submitCircle,
          scale: 0,
          duration: 600,
          easing: "easeOutQuad",
          complete: () => {
            submitCircle.style.backgroundColor = "var(--color-accent)";
          }
        });

        submitText.textContent = "SEND INQUIRY";
        submitBtn.style.color = "";
        submitBtn.style.borderColor = "";

        // Re-enable inputs
        inputs.forEach(input => input.disabled = false);
        submitBtn.disabled = false;
      }, 3000);
    })
    .catch((err) => {
      console.error("Email sending error:", err);

      // Transition to error state
      submitText.textContent = "ERROR! TRY AGAIN";
      submitBtn.style.borderColor = "#ff4444";
      submitCircle.style.backgroundColor = "#ff4444";

      // Wait 3 seconds, then restore original button state to allow retrying
      setTimeout(() => {
        anime({
          targets: submitCircle,
          scale: 0,
          duration: 600,
          easing: "easeOutQuad",
          complete: () => {
            submitCircle.style.backgroundColor = "var(--color-accent)";
          }
        });

        submitText.textContent = "SEND INQUIRY";
        submitBtn.style.color = "";
        submitBtn.style.borderColor = "";

        // Re-enable inputs
        inputs.forEach(input => input.disabled = false);
        submitBtn.disabled = false;
      }, 3000);
    });
  });
}

/* ==========================================================================
   11. INTERACTIVE 3D PERSPECTIVE CARD TILT
   ========================================================================== */
function initCard3DTilt() {
  // Mobile-safe guard: disable tilt on touch devices
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const cards = document.querySelectorAll(".about-grid-item:not(.bento-card), .project-card, .education-card, .premium-card");

  cards.forEach(card => {
    // 1. ScrollTrigger Entrance Animation for Premium Cards
    if (card.classList.contains("premium-card")) {
      gsap.fromTo(card,
        { y: 60, opacity: 0, rotationX: -15 },
        {
          y: 0, opacity: 1, rotationX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (isTouch) return; // Skip hover effects on mobile

    let rect = null;
    const maxTilt = 8; // Maximum rotation angle in degrees

    // QuickTo for smooth GSAP physics-based follow
    const xTo = gsap.quickTo(card, "rotationY", { ease: "power3.out", duration: 0.4 });
    const yTo = gsap.quickTo(card, "rotationX", { ease: "power3.out", duration: 0.4 });
    const floatTo = gsap.quickTo(card, "y", { ease: "power3.out", duration: 0.4 });

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener("mousemove", (e) => {
      if (!rect) rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation angles
      const normX = (x / rect.width) - 0.5;
      const normY = (y / rect.height) - 0.5;

      const rotateX = -(normY * maxTilt);
      const rotateY = (normX * maxTilt);

      // Update custom properties for background glow tracking
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Apply 3D rotation via GSAP
      xTo(rotateY);
      yTo(rotateX);
      floatTo(-8);
    });

    card.addEventListener("mouseleave", () => {
      rect = null;
      xTo(0);
      yTo(0);
      floatTo(0);

      // Keep glow at center smoothly fading out
      card.style.setProperty("--mouse-x", `${card.offsetWidth / 2}px`);
      card.style.setProperty("--mouse-y", `${card.offsetHeight / 2}px`);
    });
  });
}

/* ==========================================================================
   12. AMBIENT CANVAS BACKGROUND
   ========================================================================== */
class AmbientBlob {
  constructor(canvas, x, y, radius, color, isMouseFollower = false) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.baseRadius = radius;
    this.color = color;
    this.isMouseFollower = isMouseFollower;

    // Movement velocities
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;

    // Scale pulsing
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = 0.001 + Math.random() * 0.002;

    // Lerp targets
    this.tx = x;
    this.ty = y;
  }

  update(mouseX, mouseY) {
    if (this.isMouseFollower) {
      // Lerp to mouse position
      this.tx += (mouseX - this.tx) * 0.035;
      this.ty += (mouseY - this.ty) * 0.035;
      this.x = this.tx;
      this.y = this.ty;
    } else {
      // Drift slowly
      this.x += this.vx;
      this.y += this.vy;

      // Boundary collision (wrap around smoothly)
      if (this.x < -this.radius) this.x = this.canvas.width + this.radius;
      if (this.x > this.canvas.width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = this.canvas.height + this.radius;
      if (this.y > this.canvas.height + this.radius) this.y = -this.radius;
    }

    // Pulsing morph
    this.angle += this.angleSpeed;
    this.radius = this.baseRadius + Math.sin(this.angle) * (this.baseRadius * 0.12);
  }

  draw(ctx) {
    ctx.save();
    const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.01, this.x, this.y, this.radius);

    // Extrapolate semi-transparent colors for smooth gradient fade
    const colorRGB = this.color.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,/);
    const centerColor = this.color;
    const midColor = colorRGB ? `${colorRGB[0]} 0.35)` : 'rgba(0,0,0,0)';
    const edgeColor = colorRGB ? `${colorRGB[0]} 0)` : 'rgba(0,0,0,0)';

    gradient.addColorStop(0, centerColor);
    gradient.addColorStop(0.5, midColor);
    gradient.addColorStop(1, edgeColor);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initAmbientCanvas() {
  // Disabled to keep a clean, minimal background as requested by the user
  const canvas = document.getElementById("ambient-canvas");
  if (canvas) canvas.style.display = "none";
}

/* ==========================================================================
   13. HORIZONTAL PARALLAX SCROLL
   ========================================================================== */
function initHorizontalScroll() {
  const scrollContainer = document.querySelector(".work-scroll-container");
  const stickyWrapper = document.querySelector(".work-sticky-wrapper");
  const track = document.querySelector(".work-horizontal-track");
  if (!scrollContainer || !stickyWrapper || !track) return;

  const images = track.querySelectorAll(".project-img");

  let containerTop = 0;
  let containerHeight = 0;
  let trackWidth = 0;
  let maxTranslate = 0;
  let scrollRange = 0;

  function cacheDimensions() {
    if (window.innerWidth <= 1024) return;
    const rect = scrollContainer.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    containerTop = rect.top + scrollTop;
    containerHeight = rect.height;
    trackWidth = track.scrollWidth;
    maxTranslate = Math.max(0, trackWidth - window.innerWidth);
    scrollRange = containerHeight - window.innerHeight;
  }

  function updateScroll(e) {
    // Media query guard: natural vertical flow on mobile/tablet
    if (window.innerWidth <= 1024) {
      track.style.transform = '';
      images.forEach(img => {
        img.style.transform = '';
      });
      return;
    }

    const scrollTop = e ? (e.scroll || window.scrollY) : window.scrollY;

    let progress = (scrollTop - containerTop) / scrollRange;
    progress = Math.max(0, Math.min(1, progress));

    const trackTranslateX = -progress * maxTranslate;
    track.style.transform = `translate3d(${trackTranslateX}px, 0, 0)`;

    // Parallax effect on project images
    images.forEach(img => {
      const imgX = (progress - 0.5) * -15; // from +7.5% to -7.5%
      img.style.transform = `translate3d(${imgX}%, 0, 0)`;
    });
  }

  // Cache initially
  cacheDimensions();

  // Recache on resize and fully-loaded window
  window.addEventListener("resize", () => {
    cacheDimensions();
    updateScroll();
  });
  window.addEventListener("load", () => {
    cacheDimensions();
    updateScroll();
  });

  if (lenis) {
    lenis.on('scroll', updateScroll);
  } else {
    window.addEventListener("scroll", updateScroll);
  }

  updateScroll();
}

/* ==========================================================================
   14. INTERACTIVE JOURNEY TIMELINE
   ========================================================================== */
function initJourneyTimeline() {
  const scrollCol = document.querySelector(".journey-scroll-col");
  const progressBar = document.getElementById("journey-progress-bar");
  const journeyCards = document.querySelectorAll(".journey-card");
  const activeYearDisplay = document.getElementById("journey-active-year");
  if (!scrollCol || !progressBar) return;

  let scrollColTop = 0;
  let scrollColHeight = 0;
  let cardsData = [];

  function cacheDimensions() {
    const rect = scrollCol.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    scrollColTop = rect.top + scrollTop;
    scrollColHeight = rect.height;

    cardsData = Array.from(journeyCards).map(card => {
      const cardRect = card.getBoundingClientRect();
      return {
        element: card,
        docCenterY: cardRect.top + scrollTop + cardRect.height / 2,
        year: card.getAttribute("data-year")
      };
    });
  }

  function updateTimeline(e) {
    const scrollTop = e ? (e.scroll || window.scrollY) : window.scrollY;
    const viewportHeight = window.innerHeight;

    // 1. Progress bar height
    const currentTop = scrollColTop - scrollTop;
    const startThreshold = viewportHeight * 0.5;

    let progress = (startThreshold - currentTop) / scrollColHeight;
    progress = Math.max(0, Math.min(1, progress));

    progressBar.style.height = `${progress * 100}%`;

    // 2. Center-line proximity tracking for active year/card
    const targetLine = scrollTop + viewportHeight * 0.4;
    let closestCard = null;
    let closestDistance = Infinity;

    cardsData.forEach(cardData => {
      const distance = Math.abs(cardData.docCenterY - targetLine);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = cardData;
      }
    });

    if (closestCard) {
      journeyCards.forEach(card => {
        if (card === closestCard.element) {
          if (!card.classList.contains("active-era")) {
            card.classList.add("active-era");

            const year = closestCard.year;
            if (year && activeYearDisplay && activeYearDisplay.textContent !== year) {
              anime({
                targets: activeYearDisplay,
                opacity: [1, 0],
                translateY: [0, -10],
                duration: 150,
                easing: "easeInQuad",
                complete: () => {
                  activeYearDisplay.textContent = year;
                  anime({
                    targets: activeYearDisplay,
                    opacity: [0, 1],
                    translateY: [10, 0],
                    duration: 250,
                    easing: "easeOutQuad"
                  });
                }
              });
            }
          }
        } else {
          card.classList.remove("active-era");
        }
      });
    }
  }

  // Cache initially
  cacheDimensions();

  // Recache on resize and fully-loaded window
  window.addEventListener("resize", () => {
    cacheDimensions();
    updateTimeline();
  });
  window.addEventListener("load", () => {
    cacheDimensions();
    updateTimeline();
  });

  if (lenis) {
    lenis.on('scroll', updateTimeline);
  } else {
    window.addEventListener("scroll", updateTimeline);
  }

  updateTimeline();
}

/* ==========================================================================
   15. BENTO CARDS SPOTLIGHT & PARALLAX
   ========================================================================== */
function initBentoSpotlights() {
  const bentoCards = document.querySelectorAll(".bento-card");
  bentoCards.forEach(card => {
    let rect = null;
    const graphicWrapper = card.querySelector(".bento-graphic-wrapper");

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener("mousemove", (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Subtle 3D parallax on the graphic wrapper
      if (graphicWrapper) {
        const normX = (x / rect.width) - 0.5;
        const normY = (y / rect.height) - 0.5;
        const transX = (normX * 8).toFixed(1);
        const transY = (normY * 8).toFixed(1);
        graphicWrapper.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1.08) rotate(3deg)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      rect = null;
      card.style.setProperty("--mouse-x", "0px");
      card.style.setProperty("--mouse-y", "0px");
      if (graphicWrapper) {
        graphicWrapper.style.transform = "";
      }
    });
  });
}

/* ==========================================================================
   16. MODERN BENTO TECH STACK
   ========================================================================== */
function initModernTechStack() {
  const techCards = document.querySelectorAll('.tech-bento-card');
  const techSection = document.querySelector('.modern-tech-section');

  if (techCards.length === 0 || !techSection) return;

  // 1. Staggered Fade-Up Entrance (Framer Motion feel)
  gsap.fromTo(techCards,
    {
      y: 60,
      opacity: 0,
      scale: 0.95
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: techSection,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

};

/* ==========================================================================
   17. MOBILE TOUCH INTERACTIONS
   ========================================================================== */
function initMobileTouchInteractions() {
  const touchItems = document.querySelectorAll(".bento-card, .tech-icon-node, .project-card, .services-row, .other-project-row, .blog-card");

  touchItems.forEach(item => {
    item.addEventListener("touchstart", () => {
      item.classList.add("touch-active");
    }, { passive: true });

    item.addEventListener("touchend", () => {
      setTimeout(() => {
        item.classList.remove("touch-active");
      }, 500); // Keep visual feedback active briefly
    }, { passive: true });

    item.addEventListener("touchcancel", () => {
      item.classList.remove("touch-active");
    }, { passive: true });
  });
}

/* ==========================================================================
   18. BLOG FILTERS & REAL-TIME SEARCH LOGIC
   ========================================================================== */
function initBlogFilters() {
  const filterTabs = document.getElementById("blog-filter-tabs");
  const searchInput = document.getElementById("blog-search");
  if (!filterTabs && !searchInput) return;

  const filterBtns = filterTabs ? filterTabs.querySelectorAll(".filter-btn") : [];
  const blogCards = document.querySelectorAll(".blog-card");
  const countDisplay = document.getElementById("blog-count-display");

  let activeFilter = "all";
  let searchQuery = "";

  function filterLogs() {
    let visibleCount = 0;

    gsap.to(".blog-feed-timeline", {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        blogCards.forEach(card => {
          const category = card.getAttribute("data-category") || "";
          const title = card.querySelector(".blog-card-title")?.textContent || "";
          const excerpt = card.querySelector(".blog-card-excerpt")?.textContent || "";
          const techTags = Array.from(card.querySelectorAll(".blog-card-tech span"))
            .map(span => span.textContent)
            .join(" ");

          const matchesCategory = activeFilter === "all" || category === activeFilter;
          const searchString = `${title} ${excerpt} ${techTags}`.toLowerCase();
          const matchesSearch = searchString.includes(searchQuery);

          if (matchesCategory && matchesSearch) {
            card.style.display = "flex";
            visibleCount++;
          } else {
            card.style.display = "none";
          }
        });

        // Update entries text
        if (countDisplay) {
          if (searchQuery) {
            countDisplay.textContent = `${visibleCount} Entry${visibleCount === 1 ? "" : "ies"} Found`;
          } else {
            countDisplay.textContent = `${visibleCount} Entry${visibleCount === 1 ? "" : "ies"} Loaded`;
          }
        }

        // Fade timeline back in
        gsap.to(".blog-feed-timeline", {
          opacity: 1,
          duration: 0.3,
          clearProps: "opacity"
        });
      }
    });
  }

  // Bind category tabs
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter") || "all";
      filterLogs();
    });
  });

  // Bind search input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterLogs();
    });
  }
}

/* ==========================================================================
   19. BLOG CARD SPOTLIGHT LOGIC
   ========================================================================== */
function initBlogSpotlights() {
  const blogCards = document.querySelectorAll(".blog-card");
  if (blogCards.length === 0) return;

  blogCards.forEach(card => {
    let rect = null;

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener("mousemove", (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      rect = null;
      card.style.setProperty("--mouse-x", "0px");
      card.style.setProperty("--mouse-y", "0px");
    });
  });
}

/* ==========================================================================
   20. IN-DEPTH ARTICLE READER OVERLAY LOGIC
   ========================================================================== */
function initBlogReader() {
  const reader = document.getElementById("blog-reader");
  if (!reader) return;

  const closeBtn = document.getElementById("reader-close-btn");
  const backdrop = document.getElementById("reader-backdrop");
  const scrollWrapper = document.getElementById("reader-scroll-wrapper");
  const progressBar = document.getElementById("reader-progress-bar");

  // Displays
  const titleDisplay = document.getElementById("reader-title-display");
  const categoryDisplay = document.getElementById("reader-meta-category");
  const dateDisplay = document.getElementById("reader-meta-date");
  const contentDisplay = document.getElementById("reader-body-content");

  // Find all cards with deep read action
  const articleCards = document.querySelectorAll(".blog-card[data-post-type='article']");

  function openReader(card) {
    const title = card.querySelector(".blog-card-title")?.textContent || "";
    const category = card.querySelector(".blog-card-tag")?.textContent || "";
    const date = card.querySelector(".blog-card-date")?.textContent || "";
    const htmlContent = card.querySelector(".hidden-article-content")?.innerHTML || "";

    // Inject content
    if (titleDisplay) titleDisplay.textContent = title;
    if (categoryDisplay) categoryDisplay.textContent = category;
    if (dateDisplay) dateDisplay.textContent = date;
    if (contentDisplay) contentDisplay.innerHTML = htmlContent;

    // Reset scroll and progress bar
    if (scrollWrapper) scrollWrapper.scrollTop = 0;
    if (progressBar) progressBar.style.width = "0%";

    // Activate overlay
    reader.classList.add("active");
    reader.setAttribute("aria-hidden", "false");
    document.body.classList.add("reader-open");

    // Disable background page scrolling
    if (lenis) lenis.stop();
  }

  function closeReader() {
    reader.classList.remove("active");
    reader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("reader-open");

    // Enable background page scrolling
    if (lenis) lenis.start();

    // Reset progress bar after animate completes
    setTimeout(() => {
      if (progressBar) progressBar.style.width = "0%";
    }, 400);
  }

  // Bind deep read triggers
  articleCards.forEach(card => {
    const btn = card.querySelector(".read-more-btn");

    // Clicking either button or card body triggers reader
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openReader(card);
      });
    }

    card.addEventListener("click", () => {
      openReader(card);
    });
  });

  // Bind close buttons
  if (closeBtn) closeBtn.addEventListener("click", closeReader);
  if (backdrop) backdrop.addEventListener("click", closeReader);

  // Esc key closure
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && reader.classList.contains("active")) {
      closeReader();
    }
  });

  // Track scroll progress
  if (scrollWrapper && progressBar) {
    scrollWrapper.addEventListener("scroll", () => {
      const scrollTop = scrollWrapper.scrollTop;
      const scrollHeight = scrollWrapper.scrollHeight - scrollWrapper.clientHeight;
      if (scrollHeight > 0) {
        const percent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${percent}%`;
      }
    });
  }
}



