document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('login-form');
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const errorAlert = document.getElementById('login-error');

  const addSiteForm = document.getElementById('add-site-form');
  const resultSection = document.getElementById('result-section');
  const outputCode = document.getElementById('output-code');
  const btnCopy = document.getElementById('copy-btn');
  const btnDownload = document.getElementById('download-btn');

  // Load existing data from the window object (from data.js) or localStorage
  let currentShowcaseData = typeof SHOWCASE_DATA !== 'undefined' ? [...SHOWCASE_DATA] : [];
  try {
    const stored = localStorage.getItem('showcaseData');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length >= 0) {
        currentShowcaseData = parsed;
      }
    }
  } catch (e) { console.warn('localStorage read error', e); }

  // Helper to hash passwords using SHA-256
  async function hashVal(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ==========================================
  // Password Challenge
  // ==========================================
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = document.getElementById('password').value;

    const hashedPw = await hashVal(pw);

    // Check against pre-computed SHA-256 hash of the valid password
    if (hashedPw === 'e38e07946476dd461b4aaeb9a297b199d47c63c4579f5bed7df838db19d0b109') {
      // Success! Move to Dashboard
      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
    } else {
      // Error
      errorAlert.classList.remove('hidden');
      setTimeout(() => {
        errorAlert.classList.add('hidden');
      }, 3000);
    }
  });

  // ==========================================
  // Image Type Toggle
  // ==========================================
  const typeUrl = document.getElementById('type-url');
  const typeFile = document.getElementById('type-file');
  const imgUrlWrapper = document.getElementById('img-url-wrapper');
  const imgFileWrapper = document.getElementById('img-file-wrapper');

  typeUrl.addEventListener('change', () => {
    imgUrlWrapper.classList.remove('hidden');
    imgFileWrapper.classList.add('hidden');
  });

  typeFile.addEventListener('change', () => {
    imgUrlWrapper.classList.add('hidden');
    imgFileWrapper.classList.remove('hidden');
  });

  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

  // ==========================================
  // Generate Data & Code
  // ==========================================
  addSiteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Grab values
    const title = document.getElementById('site-title').value;
    const desc = document.getElementById('site-desc').value;
    const url = document.getElementById('site-url').value;

    let image = '';

    if (typeUrl.checked) {
      image = document.getElementById('site-image-url').value;
      if (!image) { alert('Please enter an image URL.'); return; }
    } else {
      const fileInput = document.getElementById('site-image-file');
      if (fileInput.files.length === 0) { alert('Please select an image file.'); return; }
      image = await getBase64(fileInput.files[0]);
    }

    // Push to current data
    currentShowcaseData.push({
      title,
      description: desc,
      url,
      image
    });

    try {
      localStorage.setItem('showcaseData', JSON.stringify(currentShowcaseData));
    } catch (e) { console.warn('localStorage write error', e); }

    // Generate the raw JS code string
    const stringifiedData = JSON.stringify(currentShowcaseData, null, 2);

    const newJSContent = `// data.js - Holds the configuration for your showcased websites
const SHOWCASE_DATA = ${stringifiedData};

// If we're in a common js environment (like Node) we'll export it, 
// but for standard browsers we just let it sit in the global window object.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SHOWCASE_DATA;
}
`;

    // Show output
    outputCode.value = newJSContent;
    resultSection.classList.remove('hidden');

    // Reset Form (Optional: keep values if they want to add multiple quickly)
    addSiteForm.reset();
  });

  // ==========================================
  // Copy to Clipboard
  // ==========================================
  btnCopy.addEventListener('click', () => {
    outputCode.select();
    document.execCommand('copy');

    const originalText = btnCopy.textContent;
    btnCopy.textContent = "Copied!";
    setTimeout(() => btnCopy.textContent = originalText, 2000);
  });

  // ==========================================
  // Download File 
  // ==========================================
  btnDownload.addEventListener('click', () => {
    const blob = new Blob([outputCode.value], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

});
