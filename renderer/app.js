(() => {
  const MAX_BYTES = 500 * 1024;
  const MOSAIC_BLOCK = 10;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const pickFile = document.getElementById('pick-file');
  const placeholder = document.getElementById('canvas-placeholder');
  const canvasShell = document.getElementById('canvas-shell');
  const btnExport = document.getElementById('btn-export');
  const btnMaskMode = document.getElementById('btn-mask-mode');
  const btnMaskUndo = document.getElementById('btn-mask-undo');
  const btnMaskClear = document.getElementById('btn-mask-clear');
  const maskHint = document.getElementById('mask-hint');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const menuImageToggle = document.getElementById('menu-image-toggle');
  const menuImageSub = document.getElementById('menu-image-sub');
  const menuWatermark = document.getElementById('menu-watermark');
  const watermarkPage = document.getElementById('watermark-page');

  const wmText = document.getElementById('wm-text');
  const wmOpacity = document.getElementById('wm-opacity');
  const wmOpacityNum = document.getElementById('wm-opacity-num');
  const wmAngle = document.getElementById('wm-angle');
  const wmAngleNum = document.getElementById('wm-angle-num');
  const wmSize = document.getElementById('wm-size');
  const wmSizeNum = document.getElementById('wm-size-num');

  /** @type {HTMLImageElement | null} */
  let sourceImage = null;
  /** @type {{ x: number; y: number; w: number; h: number }[]} */
  let maskRegions = [];

  let maskMode = false;
  /** @type {{ x: number; y: number } | null} */
  let dragStart = null;
  /** @type {{ x: number; y: number; w: number; h: number } | null} */
  let dragPreview = null;

  function clientToCanvas(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * sx,
      y: (clientY - rect.top) * sy,
    };
  }

  function normalizeRect(x0, y0, x1, y1) {
    const x = Math.min(x0, x1);
    const y = Math.min(y0, y1);
    const w = Math.abs(x1 - x0);
    const h = Math.abs(y1 - y0);
    return { x, y, w, h };
  }

  function pixelateRect(x, y, w, h) {
    const ix = Math.max(0, Math.floor(x));
    const iy = Math.max(0, Math.floor(y));
    const iw = Math.min(canvas.width - ix, Math.ceil(w));
    const ih = Math.min(canvas.height - iy, Math.ceil(h));
    if (iw < 2 || ih < 2) return;

    const imgData = ctx.getImageData(ix, iy, iw, ih);
    const d = imgData.data;
    for (let by = 0; by < ih; by += MOSAIC_BLOCK) {
      for (let bx = 0; bx < iw; bx += MOSAIC_BLOCK) {
        const bw = Math.min(MOSAIC_BLOCK, iw - bx);
        const bh = Math.min(MOSAIC_BLOCK, ih - by);
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        for (let py = 0; py < bh; py++) {
          for (let px = 0; px < bw; px++) {
            const i = ((by + py) * iw + (bx + px)) * 4;
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
            n++;
          }
        }
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);
        for (let py = 0; py < bh; py++) {
          for (let px = 0; px < bw; px++) {
            const i = ((by + py) * iw + (bx + px)) * 4;
            d[i] = r;
            d[i + 1] = g;
            d[i + 2] = b;
          }
        }
      }
    }
    ctx.putImageData(imgData, ix, iy);
  }

  function drawTiledWatermark(text, fontSize, angleDeg, opacityPct) {
    const w = canvas.width;
    const h = canvas.height;
    if (!text || w === 0 || h === 0) return;

    const opacity = Math.min(1, Math.max(0, opacityPct / 100));
    ctx.save();
    ctx.font = `${fontSize}px system-ui, 'Microsoft YaHei', sans-serif`;
    ctx.fillStyle = `rgba(120, 128, 150, ${opacity})`;
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(text);
    const tw = Math.max(metrics.width, fontSize);
    const th = Math.max(fontSize * 1.6, 24);
    const stepX = tw + fontSize * 0.8;
    const stepY = th + fontSize * 0.4;
    const rad = (angleDeg * Math.PI) / 180;
    const diag = Math.sqrt(w * w + h * h) + stepX + stepY;

    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.translate(-w / 2, -h / 2);

    for (let y = -diag; y < diag + h; y += stepY) {
      for (let x = -diag; x < diag + w; x += stepX) {
        ctx.fillText(text, x, y + th / 2);
      }
    }
    ctx.restore();
  }

  function paint() {
    if (!sourceImage) return;

    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.drawImage(sourceImage, 0, 0);

    for (const r of maskRegions) {
      pixelateRect(r.x, r.y, r.w, r.h);
    }

    drawTiledWatermark(
      wmText.value.trim() || ' ',
      Number(wmSize.value),
      Number(wmAngle.value),
      Number(wmOpacity.value),
    );

    if (dragPreview && dragPreview.w > 1 && dragPreview.h > 1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.9)';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.strokeRect(dragPreview.x, dragPreview.y, dragPreview.w, dragPreview.h);
      ctx.restore();
    }
  }

  let raf = 0;
  function schedulePaint() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(paint);
  }

  function setHasImage(has) {
    placeholder.classList.toggle('canvas-placeholder--hidden', has);
    btnExport.disabled = !has;
    if (!has) {
      maskRegions = [];
      updateMaskButtons();
    }
  }

  function updateMaskButtons() {
    btnMaskUndo.disabled = maskRegions.length === 0;
    btnMaskClear.disabled = maskRegions.length === 0;
  }

  function loadFile(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/i.test(file.type)) {
      alert('仅支持 jpg / png 格式');
      return;
    }
    if (file.size > MAX_BYTES) {
      alert('文件大小不能超过 500kb');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      sourceImage = img;
      setHasImage(true);
      schedulePaint();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert('无法读取该图片');
    };
    img.src = url;
  }

  function bindRangePair(range, num, min, max) {
    const clamp = (v) => Math.min(max, Math.max(min, v));
    range.addEventListener('input', () => {
      num.value = String(clamp(Number(range.value)));
      schedulePaint();
    });
    num.addEventListener('input', () => {
      const v = clamp(Number(num.value) || min);
      num.value = String(v);
      range.value = String(v);
      schedulePaint();
    });
  }

  bindRangePair(wmOpacity, wmOpacityNum, 5, 100);
  bindRangePair(wmAngle, wmAngleNum, -90, 90);
  bindRangePair(wmSize, wmSizeNum, 12, 120);

  function showWatermarkPage() {
    if (watermarkPage) {
      watermarkPage.classList.add('page--active');
    }
    if (menuWatermark) {
      menuWatermark.classList.add('menu-tree__item--active');
    }
    schedulePaint();
  }

  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('sidebar--collapsed');
      sidebarToggle.textContent = collapsed ? '展开侧边栏' : '收起侧边栏';
      sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  if (menuImageToggle && menuImageSub) {
    menuImageToggle.addEventListener('click', () => {
      const expanded = menuImageToggle.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      menuImageToggle.setAttribute('aria-expanded', String(next));
      menuImageSub.classList.toggle('menu-tree__sub--hidden', !next);
    });
  }

  if (menuWatermark) {
    menuWatermark.addEventListener('click', showWatermarkPage);
  }

  wmText.addEventListener('input', schedulePaint);

  pickFile.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dropzone--drag');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dropzone--drag');
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dropzone--drag');
    const f = e.dataTransfer?.files?.[0];
    loadFile(f);
  });

  fileInput.addEventListener('change', () => {
    loadFile(fileInput.files?.[0]);
    fileInput.value = '';
  });

  btnMaskMode.addEventListener('click', () => {
    maskMode = !maskMode;
    btnMaskMode.classList.toggle('btn--secondary', maskMode);
    btnMaskMode.classList.toggle('btn--ghost', !maskMode);
    btnMaskMode.textContent = maskMode ? '完成打码（点击退出）' : '添加打码区域';
    canvasShell.classList.toggle('canvas-shell--mask-mode', maskMode);
    maskHint.textContent = maskMode
      ? '在预览图上按住拖拽框选要打码的区域，可多次添加。'
      : '在下方预览图上拖拽矩形，对敏感信息进行像素打码（仅本地处理）。';
  });

  btnMaskUndo.addEventListener('click', () => {
    maskRegions.pop();
    updateMaskButtons();
    schedulePaint();
  });

  btnMaskClear.addEventListener('click', () => {
    maskRegions = [];
    updateMaskButtons();
    schedulePaint();
  });

  canvas.addEventListener('mousedown', (e) => {
    if (!maskMode || !sourceImage) return;
    dragStart = clientToCanvas(e.clientX, e.clientY);
    dragPreview = { x: dragStart.x, y: dragStart.y, w: 0, h: 0 };
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragStart) return;
    const p = clientToCanvas(e.clientX, e.clientY);
    dragPreview = normalizeRect(dragStart.x, dragStart.y, p.x, p.y);
    schedulePaint();
  });

  window.addEventListener('mouseup', () => {
    if (!dragStart || !dragPreview) {
      dragStart = null;
      dragPreview = null;
      return;
    }
    if (dragPreview.w > 4 && dragPreview.h > 4) {
      maskRegions.push({ ...dragPreview });
      updateMaskButtons();
    }
    dragStart = null;
    dragPreview = null;
    schedulePaint();
  });

  btnExport.addEventListener('click', async () => {
    if (!sourceImage) return;
    paint();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) {
      alert('导出失败');
      return;
    }
    const buf = await blob.arrayBuffer();
    const api = window.shadowfax;
    if (api?.saveImage) {
      const res = await api.saveImage(buf, '证件打码.png');
      if (res?.ok) {
        /* saved */
      } else if (res && res.ok === false) {
        /* cancelled */
      }
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '证件打码.png';
      a.click();
      URL.revokeObjectURL(a.href);
    }
  });
})();
