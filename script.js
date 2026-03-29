document.addEventListener('DOMContentLoaded', () => {

  const gridContainer = document.getElementById('showcase-grid');

  // Check if SHOWCASE_DATA exists (from local storage or data.js)
  let renderData = typeof SHOWCASE_DATA !== 'undefined' ? [...SHOWCASE_DATA] : [];
  try {
    const stored = localStorage.getItem('showcaseData');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length >= 0) {
        renderData = parsed;
      }
    }
  } catch(e) { console.warn('localStorage read error', e); }

  if (renderData && gridContainer) {
    
    renderData.forEach((site, index) => {
      // Create Card Anchor
      const card = document.createElement('a');
      card.href = site.url;
      card.className = 'card';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.style.animationDelay = `${index * 0.15}s`; // Staggered animation
      
      const cardInner = document.createElement('div');
      cardInner.className = 'card-inner';
      
      // Image wrapper
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'card-img-wrapper';
      const img = document.createElement('img');
      img.src = site.image;
      img.alt = site.title;
      img.className = 'card-img';
      img.loading = 'lazy';
      imgWrapper.appendChild(img);
      
      // Content wrapper
      const content = document.createElement('div');
      content.className = 'card-content';
      
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.textContent = site.title;
      
      const desc = document.createElement('p');
      desc.className = 'card-desc';
      desc.textContent = site.description;
      
      const linkText = document.createElement('span');
      linkText.className = 'card-link';
      linkText.innerHTML = 'Visit Site &rarr;';
      
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(linkText);
      
      cardInner.appendChild(imgWrapper);
      cardInner.appendChild(content);
      card.appendChild(cardInner);
      
      gridContainer.appendChild(card);
    });

  }

  // Optional: Intersection Observer for elegant scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Example: we can observe headers or other elements
  document.querySelectorAll('.section-title').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
  });

});
