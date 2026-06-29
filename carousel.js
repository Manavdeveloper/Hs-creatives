let currentTab = 0;
let currentSlide = 0;

const carouselData = {
  0: { name: 'Logos', slides: [] },
  1: { name: 'Menus', slides: [] },
  2: { name: 'Posts', slides: [] }
};

function initCarousel() {
  renderUploadUI();
  renderCarousel();
}

function renderUploadUI() {
  const section = document.getElementById('portfolio');
  const uploadContainer = document.createElement('div');
  uploadContainer.className = 'upload-container';
  uploadContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <p style="font-size: 0.7rem; color: #8b8b7f; margin-bottom: 1rem;">Upload images for each category</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <div>
          <input type="file" id="logoUpload" multiple accept="image/*" onchange="addImages(0, this.files)" style="display: none;" />
          <button class="btn btn-secondary" onclick="document.getElementById('logoUpload').click()" style="font-size: 0.6rem;">Upload Logos</button>
        </div>
        <div>
          <input type="file" id="menuUpload" multiple accept="image/*" onchange="addImages(1, this.files)" style="display: none;" />
          <button class="btn btn-secondary" onclick="document.getElementById('menuUpload').click()" style="font-size: 0.6rem;">Upload Menus</button>
        </div>
        <div>
          <input type="file" id="postUpload" multiple accept="image/*" onchange="addImages(2, this.files)" style="display: none;" />
          <button class="btn btn-secondary" onclick="document.getElementById('postUpload').click()" style="font-size: 0.6rem;">Upload Posts</button>
        </div>
      </div>
    </div>
  `;
  
  const portfolioTabs = document.querySelector('.portfolio-tabs');
  portfolioTabs.parentNode.insertBefore(uploadContainer, portfolioTabs);
}

function addImages(tabIndex, files) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      carouselData[tabIndex].slides.push(e.target.result);
      if (currentTab === tabIndex) {
        renderCarousel();
      }
    };
    reader.readAsDataURL(file);
  });
}

function renderCarousel() {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('dotsContainer');
  const slides = carouselData[currentTab].slides;

  track.innerHTML = slides.map(src => `
    <div class="carousel-slide">
      <img src="${src}" alt="Slide" />
    </div>
  `).join('');

  dotsContainer.innerHTML = slides.map((_, i) => `
    <span class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>
  `).join('');

  currentSlide = 0;
  updateCarouselPosition();
}

function updateCarouselPosition() {
  const track = document.getElementById('carouselTrack');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  const slides = carouselData[currentTab].slides;
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarouselPosition();
}

function prevSlide() {
  const slides = carouselData[currentTab].slides;
  if (slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarouselPosition();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarouselPosition();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === tab);
  });
  renderCarousel();
}

// Auto-rotate every 5 seconds
setInterval(() => nextSlide(), 5000);

// Initialize on load
document.addEventListener('DOMContentLoaded', initCarousel);
