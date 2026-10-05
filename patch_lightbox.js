const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  "lightbox.style.display = 'block';",
  `lightbox.style.display = 'flex';
    const imgContainer = document.getElementById('lightbox-img-container');
    if (imgContainer) {
      imgContainer.classList.remove('zoomed');
      imgContainer.onclick = () => imgContainer.classList.toggle('zoomed');
    }`
);

code = code.replace(
  "lightbox.style.display = 'none';",
  `lightbox.style.display = 'none';
      const imgContainer = document.getElementById('lightbox-img-container');
      if (imgContainer) imgContainer.classList.remove('zoomed');`
);

fs.writeFileSync('js/main.js', code, 'utf8');
console.log('Successfully updated main.js');
