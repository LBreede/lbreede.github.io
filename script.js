const ICONS = [
  {
    id: 'readme',
    label: 'README',
    href: 'readme/readme.html',
    icon: './img/text.png',
    external: false,
    position: { top: '5%', left: '3%' }
  },
  {
    id: 'project',
    label: 'current project',
    href: 'https://www.imdb.com/title/tt14413964/',
    icon: './img/steps.png',
    external: true,
    position: { top: '39%', left: '3%' }
  },
  {
    id: 'trash',
    label: 'trash.exe',
    href: 'https://www.youtube.com/watch?v=ETgnOn3gY5s',
    icon: './img/trash.png',
    external: true,
    position: { top: '56%', left: '3%' }
  },
  {
    id: 'identicon',
    label: 'identicon.exe',
    href: '#identicon-window',
    icon: './img/kodak_imaging-0.png',
    external: false,
    appAction: 'open-identicon',
    position: { top: '73%', left: '3%' }
  },
  {
    id: 'doom',
    label: 'DOOM95_FULL-CRACKED-FLT.zip',
    href: 'https://www.youtube.com/watch?v=ThpwO5NcvhU',
    icon: './img/Doom (classic).png',
    external: true,
    position: { bottom: '5%', right: '3%' }
  }
];

const STORAGE_KEY = 'folderPositions';
const DRAG_THRESHOLD_PX = 4;

function loadPositions() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {};
  }

  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

function savePositions(folderDivs) {
  const positions = {};
  folderDivs.forEach((div) => {
    const id = div.dataset.iconId;
    if (!id) {
      return;
    }
    positions[id] = {
      top: div.style.top,
      left: div.style.left
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

function applyPosition(div, position) {
  div.style.top = position.top ?? '';
  div.style.left = position.left ?? '';
  div.style.bottom = position.bottom ?? '';
  div.style.right = position.right ?? '';
}

function buildDesktop() {
  const desktop = document.getElementById('desktop');
  if (!desktop) {
    return [];
  }

  const savedPositions = loadPositions();

  ICONS.forEach((iconData) => {
    const div = document.createElement('div');
    div.className = 'folder-pos';
    div.dataset.iconId = iconData.id;

    const link = document.createElement('a');
    link.className = 'folder';
    link.href = iconData.href;
    link.draggable = false;

    if (iconData.external) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    if (iconData.appAction) {
      link.dataset.appAction = iconData.appAction;
    }

    const image = document.createElement('img');
    image.src = iconData.icon;
    image.alt = `${iconData.label} icon`;
    image.draggable = false;

    const text = document.createElement('span');
    text.textContent = iconData.label;

    link.appendChild(image);
    link.appendChild(text);
    div.appendChild(link);
    desktop.appendChild(div);

    const stored = savedPositions[iconData.id];
    if (stored && typeof stored.top === 'string' && typeof stored.left === 'string') {
      applyPosition(div, stored);
    } else {
      applyPosition(div, iconData.position);
    }
  });

  return Array.from(desktop.querySelectorAll('.folder-pos'));
}

function clampToViewport(x, y, element) {
  const clampedX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, x));
  const clampedY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, y));
  return { x: clampedX, y: clampedY };
}

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
  const launch = document.querySelector('[data-app-action="open-identicon"]');
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
  const folderDivs = buildDesktop();
  const resetButton = document.getElementById('reset-layout');

  let dragTarget = null;
  let offsetX = 0;
  let offsetY = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let dragMoved = false;
  let suppressClickFor = null;

  folderDivs.forEach((div) => {
    div.style.cursor = 'grab';

    const link = div.querySelector('a.folder');
    if (!link) {
      return;
    }

    link.addEventListener(
      'click',
      (event) => {
        if (suppressClickFor === link) {
          event.preventDefault();
          event.stopImmediatePropagation();
          suppressClickFor = null;
        }
      },
      true
    );
    link.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    div.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) {
        return;
      }

      dragTarget = div;
      offsetX = event.clientX - div.offsetLeft;
      offsetY = event.clientY - div.offsetTop;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      dragMoved = false;
      div.style.zIndex = '1000';
      div.style.cursor = 'grabbing';
    });
  });

  document.addEventListener('pointermove', (event) => {
    if (!dragTarget) {
      return;
    }

    const targetX = event.clientX - offsetX;
    const targetY = event.clientY - offsetY;
    const movedX = Math.abs(event.clientX - pointerStartX);
    const movedY = Math.abs(event.clientY - pointerStartY);
    const crossedThreshold = movedX > DRAG_THRESHOLD_PX || movedY > DRAG_THRESHOLD_PX;

    if (!dragMoved && !crossedThreshold) {
      return;
    }

    const { x, y } = clampToViewport(targetX, targetY, dragTarget);
    dragTarget.style.bottom = '';
    dragTarget.style.right = '';
    dragTarget.style.left = `${x}px`;
    dragTarget.style.top = `${y}px`;
    dragMoved = true;
    event.preventDefault();
  });

  function endDrag() {
    if (!dragTarget) {
      return;
    }

    if (dragMoved) {
      suppressClickFor = dragTarget.querySelector('a.folder');
    }

    savePositions(folderDivs);
    dragTarget.style.zIndex = '';
    dragTarget.style.cursor = 'grab';
    dragTarget = null;
  }

  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  window.addEventListener('resize', () => {
    folderDivs.forEach((div) => {
      if (!div.style.left || !div.style.top) {
        return;
      }
      const { x, y } = clampToViewport(div.offsetLeft, div.offsetTop, div);
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
    });
    savePositions(folderDivs);
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    });
  }

  setupIdenticonWidget();
});
