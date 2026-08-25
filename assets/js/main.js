// ==========================================
// Mobile Navigation
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

}
// ==========================================
// Close Mobile Menu After Navigation
// ==========================================

const mobileNavLinks = document.querySelectorAll(".nav-links a");

mobileNavLinks.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});
// ==========================================
// Project Carousel
// ==========================================

const projectCards = document.querySelectorAll(".project-slider .project-card");
const previousProject = document.querySelector(".project-prev");
const nextProject = document.querySelector(".project-next");
const projectCount = document.querySelector(".project-count");

let currentProject = 0;

function showProject(index, direction) {

    const currentCard = document.querySelector(
        ".project-slider .project-card.active"
    );

    const nextCard = projectCards[index];

    if (currentCard === nextCard) {
        return;
    }

    /* Prepare the incoming card */
    nextCard.classList.add(
        direction === "next"
            ? "slide-in-right"
            : "slide-in-left"
    );

    nextCard.classList.add("active");

    /* Animate current card out */
    currentCard.classList.add(
        direction === "next"
            ? "slide-out-left"
            : "slide-out-right"
    );

    /* Clean up after animation */
    setTimeout(() => {

        currentCard.classList.remove(
            "active",
            "slide-out-left",
            "slide-out-right"
        );

        nextCard.classList.remove(
            "slide-in-right",
            "slide-in-left"
        );

    }, 350);

    projectCount.textContent =
        `${index + 1} / ${projectCards.length}`;
}

nextProject.addEventListener("click", () => {

    currentProject++;

    if (currentProject >= projectCards.length) {
        currentProject = 0;
    }

    showProject(currentProject, "next");

});


previousProject.addEventListener("click", () => {

    currentProject--;

    if (currentProject < 0) {
        currentProject = projectCards.length - 1;
    }

    showProject(currentProject, "previous");

});