function renderIdenticonToCanvas(canvas, raw, size) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return false;
  }

  if (raw.length === size * size * 4) {
    canvas.width = size;
    canvas.height = size;
    const imageData = new ImageData(new Uint8ClampedArray(raw), size, size);
    ctx.putImageData(imageData, 0, 0);
    return true;
  }

  if (raw.length === size * size) {
    canvas.width = size;
    canvas.height = size;
    const rgba = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < raw.length; i += 1) {
      const base = i * 4;
      const value = raw[i];
      rgba[base] = value;
      rgba[base + 1] = value;
      rgba[base + 2] = value;
      rgba[base + 3] = 255;
    }
    ctx.putImageData(new ImageData(rgba, size, size), 0, 0);
    return true;
  }

  return false;
}

async function setupIdenticonWidget() {
  const launch = document.getElementById('identicon-launch');
  const windowEl = document.getElementById('identicon-window');
  const close = document.getElementById('identicon-close');
  const input = document.getElementById('identicon-input');
  const canvas = document.getElementById('identicon-canvas');
  const status = document.getElementById('identicon-status');

  if (!launch || !windowEl || !close || !input || !canvas || !status) {
    return;
  }

  function openWindow() {
    windowEl.classList.remove('hidden');
    input.focus();
  }

  function closeWindow() {
    windowEl.classList.add('hidden');
  }

  launch.addEventListener('click', (event) => {
    event.preventDefault();
    openWindow();
  });
  close.addEventListener('click', closeWindow);

  try {
    const identiconModule = await import('./vendor/identicon/identicon.js');
    await identiconModule.default();

    const size = identiconModule.identicon_size();
    const render = identiconModule.render_identicon;

    function update() {
      const raw = render(input.value);
      const ok = renderIdenticonToCanvas(canvas, raw, size);
      status.textContent = ok
        ? `Rendered ${size}x${size} identicon`
        : `Unexpected buffer length: ${raw.length}`;
    }

    input.addEventListener('input', update);
    status.textContent = 'Ready. Type to update.';
    update();
  } catch (error) {
    console.error(error);
    status.textContent = 'Failed to load identicon WASM.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const folderDivs = document.querySelectorAll('.folder-pos');
  const storageKey = 'folderPositions';

  // Load saved positions
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const positions = JSON.parse(saved);
      folderDivs.forEach(div => {
        const key = Array.from(div.classList).find(c => c.endsWith('-pos') && c !== 'folder-pos');
        if (positions[key]) {
          div.style.top = positions[key].top;
          div.style.left = positions[key].left;
        }
      });
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  let dragTarget = null;
  let offsetX = 0;
  let offsetY = 0;
  let dragMoved = false;

  folderDivs.forEach(div => {
    div.style.cursor = 'grab';
    div.addEventListener('mousedown', (e) => {
      dragTarget = div;
      offsetX = e.clientX - div.offsetLeft;
      offsetY = e.clientY - div.offsetTop;
      div.style.zIndex = 1000;
      div.style.cursor = 'grabbing';
      dragMoved = false;
      e.preventDefault();
    });
    // Prevent click on link if drag occurred
    const link = div.querySelector('a.folder');
    if (link) {
      link.addEventListener('click', function(e) {
        if (dragMoved) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (dragTarget) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      // Keep within window
      x = Math.max(0, Math.min(window.innerWidth - dragTarget.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - dragTarget.offsetHeight, y));
      dragTarget.style.left = x + 'px';
      dragTarget.style.top = y + 'px';
      dragMoved = true;
    }
  });

  document.addEventListener('mouseup', () => {
    if (dragTarget) {
      // Save all positions
      const positions = {};
      folderDivs.forEach(div => {
        const key = Array.from(div.classList).find(c => c.endsWith('-pos') && c !== 'folder-pos');
        positions[key] = {
          top: div.style.top,
          left: div.style.left
        };
      });
      localStorage.setItem(storageKey, JSON.stringify(positions));
      dragTarget.style.zIndex = '';
      dragTarget.style.cursor = 'grab';
      dragTarget = null;
    }
  });

  setupIdenticonWidget();
});
