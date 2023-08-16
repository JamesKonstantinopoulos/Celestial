'use strict';

const header = document.querySelector('.header');
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
const nav_links = document.querySelector('.nav_links');
const tickets_tab = document.querySelector('.tickets_tab');
const slides = document.querySelectorAll('.slide');
const leftSliderBtn = document.querySelector('.sliderBtn-left');
const rightSliderBtn = document.querySelector('.sliderBtn-right');
const dotContainer = document.querySelector('.dotContainer');
const signUpBtns = document.querySelectorAll('.signUp-btn');
const overlay = document.querySelector('.overlay');
const popup = document.querySelector('.popup');
const closePopupBtn = document.querySelector('.closePopupBtn');
const sections = document.querySelectorAll('.section');
const ticket_tabs_contaner = document.querySelector('.ticketsContent')
const ticket_tabs = document.querySelectorAll('.tickets_tab');
const lazy_imgs = document.querySelectorAll('img[data-src]');
const footer_items = document.querySelector('.footer_items');
const exploreContent = document.querySelector('.exploreContent');

//Store the initial order since its gonna be changing with width
const initialChildOrder = Array.from(exploreContent.children);

//open-close Popup

const openPopup = function(){
    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closePopup = function(){
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
};

signUpBtns.forEach(btn => btn.addEventListener('click', openPopup));

closePopupBtn.addEventListener('click', closePopup);

overlay.addEventListener('click', closePopup);

document.addEventListener('keydown', (e) => e.key === 'Escape' && closePopup());

//hamburger

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');

    const visibility = nav.dataset.visible;

    if(visibility === "false")
        nav.setAttribute('data-visible', "true");
    else
        nav.setAttribute('data-visible', "false");
});


// disable transitions when resizing

let resizeTimer;

const disableTransitions = function(){
    document.body.classList.add('disable-transitions');

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => document.body.classList.remove('disable-transitions'), 350);
};

window.addEventListener('resize', disableTransitions);

// ScrollIntoView with delegation

nav_links.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.classList.contains('nav_link'))
        document.querySelector(e.target.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
});

//IntesectionObserver for sticky nav

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries, _){
    const [entry] = entries;
    if(!entry.isIntersecting)
        nav.classList.add('sticky');
    else
        nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
});

navObserver.observe(header);

//slider

let slideNumber = 0;

const createDots = function(){
    slides.forEach((_, i) => {
        dotContainer.insertAdjacentHTML('beforeend', `<button class="dot" data-slide="${i}"></button>`);
    })
};

const activateDot = function(slide){
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('dot-active'));
    document.querySelector(`.dot[data-slide="${slide}"`).classList.add('dot-active');
}

createDots();

const goToSlide = function(slide){
    slides.forEach((sl, i) => {
        sl.style.transform = `translateX(${150 * (i - slide)}%)`;
    });
    activateDot(slide);
}

goToSlide(0);

const prevSlide = function(){
    if(slideNumber === 0)
        slideNumber = slides.length - 1;
    else
        slideNumber--;

    goToSlide(slideNumber);
};

const nextSlide = function(){
    if(slideNumber === slides.length - 1)
        slideNumber = 0;
    else
        slideNumber++;

    goToSlide(slideNumber);
};

leftSliderBtn.addEventListener('click', prevSlide);
rightSliderBtn.addEventListener('click', nextSlide);
document.addEventListener('keydown', (e) => e.key === 'ArrowLeft' && prevSlide() || e.key === 'ArrowRight' && nextSlide());

dotContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('dot')){
        slideNumber = e.target.dataset.slide;
        goToSlide(slideNumber);
    }
});

//sections appear with IntercestionObserver

const revealSection = function(entries, observer){
    const [entry] = entries;

    if(!entry.isIntersecting) return;

    entry.target.classList.remove('section-hidden');

    observer.unobserve(entry.target);
};

const sectionRevealObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.1
});

sections.forEach(section => {
    sectionRevealObserver.observe(section);
    section.classList.add('section-hidden');
});

// Rotate the ticket tabs when clicked

let isFlipped = false;

ticket_tabs_contaner.addEventListener('click', (e) => {

    if(!e.target.classList.contains('tickets_tab-btn')){
        const tab = e.target.closest('.tickets_tab');
        if(tab){
            if(!isFlipped)
                tab.classList.add('tab-flip');
            else
                tab.classList.remove('tab-flip');
    
            tab.addEventListener('mouseleave', function(){
                tab.classList.remove('tab-flip');
                isFlipped = false;
            });
        }
    }
    isFlipped = !isFlipped;
});

// Load lazy images

const loadImages = function(entries, observer){
    const [entry] = entries;

    if(!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function(){this.classList.remove('lazy-img')});

    observer.unobserve(entry.target);
}

const lazyImgObserver = new IntersectionObserver(loadImages, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
});

lazy_imgs.forEach(img => lazyImgObserver.observe(img));

// Disable footer default behavior

footer_items.addEventListener('click', (e) => e.preventDefault());

// Change the order of the explore children on small screen size

function checkMedia_order(media){
    if(media.matches){
        exploreContent.replaceChildren(...[...exploreContent.children].sort((a,b) => a.dataset.order - b.dataset.order));
    }
    else{
        exploreContent.replaceChildren(...initialChildOrder);
    }
};

const x = window.matchMedia("(max-width: 50em)");
checkMedia_order(x); //check if the width is matching the page width at initial page load
x.addEventListener('change', checkMedia_order);

// Show explore components when interacting with viewport

const bringImg = function(entries, observer){

    entries.forEach(entry => {
        if(!entry.isIntersecting) return;

        entry.target.style.transform = 'translateX(0)';
        observer.unobserve(entry.target);
    })
};

const bringImgObserver = new IntersectionObserver(bringImg, {
    root: null,
    threshold: 0
});

initialChildOrder.forEach(child => bringImgObserver.observe(child));