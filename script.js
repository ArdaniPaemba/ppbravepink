const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');
const browserWarning = document.getElementById('browser-warning');

let img = new Image();
if (navigator.userAgent.includes('Instagram')) {
  browserWarning.style.display = 'block';
}
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});
function applyDuotone(mode) {
  if (!img.src) {
    alert('Silakan upload gambar terlebih dahulu!');
    return;
  }

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const pink = [247, 132, 197]; 
  const green = [27, 96, 47];  

  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    let highlight, shadow;

    if (mode === 'pink') {
      highlight = pink;
      shadow = green;
    } else {
      highlight = green;
      shadow = pink;
    }

    data[i] = shadow[0] + (highlight[0] - shadow[0]) * (gray / 255);
    data[i + 1] = shadow[1] + (highlight[1] - shadow[1]) * (gray / 255);
    data[i + 2] = shadow[2] + (highlight[2] - shadow[2]) * (gray / 255);
  }

  ctx.putImageData(imageData, 0, 0);
  downloadBtn.disabled = false;
}
downloadBtn.addEventListener('click', () => {
  if (!img.src) {
    alert('Silakan upload dan proses gambar terlebih dahulu!');
    return;
  }
  canvas.toBlob((blob) => {
    saveAs(blob, 'hasil.png');
  }, 'image/png');
});
