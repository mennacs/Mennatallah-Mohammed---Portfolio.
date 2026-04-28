const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const profileImage = document.getElementById("profileImage");
const imageShell = document.getElementById("imageShell");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const menuBtn = document.getElementById("menuBtn");
const navList = document.getElementById("navList");
const toTop = document.getElementById("toTop");
const loader = document.getElementById("loader");
const revealElements = document.querySelectorAll(".reveal");
const skillCards = document.querySelectorAll(".skill-card");
const testimonials = document.querySelectorAll(".testimonial");
const testimonialBox = document.getElementById("testimonialBox");
const copyButtons = document.querySelectorAll(".copy-btn");

const THEME_KEY = "portfolio-theme";
const PROFILE_IMAGES = {
  light: "assets/Gemini_Generated_Image_bzor3jbzor3jbzor.png",
  dark: "assets/dark mode.png"
};
let testimonialIndex = 0;
let sliderTimer;

function preloadProfileImages() {
  Object.values(PROFILE_IMAGES).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function setTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark-mode", isDark);
  body.classList.toggle("light-mode", !isDark);

  themeToggle.classList.add("spin");
  setTimeout(() => themeToggle.classList.remove("spin"), 650);

  themeToggle.querySelector(".toggle-core").innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  imageShell.classList.remove("light-glow", "dark-glow");
  imageShell.classList.add(isDark ? "dark-glow" : "light-glow");

  const target = isDark ? PROFILE_IMAGES.dark : PROFILE_IMAGES.light;
  if (profileImage.getAttribute("src") !== target) {
    profileImage.classList.add("fade");
    setTimeout(() => {
      profileImage.src = target;
      profileImage.onload = () => {
        profileImage.classList.remove("fade");
      };
      // Ensure fade class is removed even if cached images skip onload.
      setTimeout(() => profileImage.classList.remove("fade"), 360);
    }, 220);
  }

  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  setTheme(saved);
}

themeToggle.addEventListener("click", () => {
  const next = body.classList.contains("dark-mode") ? "light" : "dark";
  setTheme(next);
});

menuBtn.addEventListener("click", () => {
  navList.classList.toggle("show");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => navList.classList.remove("show"));
});

function updateActiveNav() {
  let current = "home";
  sections.forEach((section) => {
    const top = section.offsetTop - 130;
    const height = section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      current = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

function handleToTop() {
  toTop.classList.toggle("show", window.scrollY > 460);
}

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((el) => observer.observe(el));

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const bar = entry.target.querySelector(".progress span");
      const value = entry.target.getAttribute("data-progress");
      bar.style.width = `${value}%`;
      skillsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

skillCards.forEach((card) => skillsObserver.observe(card));

function showTestimonial(index) {
  testimonials.forEach((item, idx) => item.classList.toggle("active", idx === index));
}

function startSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    showTestimonial(testimonialIndex);
  }, 4300);
}

if (testimonials.length > 0) {
  showTestimonial(0);
  startSlider();
  testimonialBox.addEventListener("mouseenter", () => clearInterval(sliderTimer));
  testimonialBox.addEventListener("mouseleave", startSlider);
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = button.getAttribute("data-copy");
    const old = button.textContent;

    try {
      await navigator.clipboard.writeText(value);
      button.textContent = "Copied!";
    } catch (error) {
      button.textContent = "Failed";
    }

    setTimeout(() => {
      button.textContent = old;
    }, 1200);
  });
});

window.addEventListener("scroll", () => {
  updateActiveNav();
  handleToTop();
});

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 700);
});

initTheme();
preloadProfileImages();
updateActiveNav();
handleToTop();
