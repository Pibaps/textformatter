document.getElementById('upload').addEventListener('change', handleImageUpload);
const downloadButton = document.getElementById('download-crop');
const toggleShapeButton = document.getElementById('toggle-shape');
const toggleCropButton = document.getElementById('toggle-crop');
let croppieInstance;
let currentShape = 'circle';
let cropEnabled = true;

const brightnessInput = document.getElementById('brightness');
const contrastInput = document.getElementById('contrast');
const saturationInput = document.getElementById('saturation');
let imgContainer;

function applyFilters() {
    const brightness = brightnessInput.value;
    const contrast = contrastInput.value;
    const saturation = saturationInput.value;

    imgContainer.style.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
}

brightnessInput.addEventListener('input', applyFilters);
contrastInput.addEventListener('input', applyFilters);
saturationInput.addEventListener('input', applyFilters);

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        imgContainer = document.getElementById('image');
        imgContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = e.target.result;
        imgContainer.appendChild(img);

        if (cropEnabled) {
            initializeCroppie(img);
        }

        applyFilters();
    };
    reader.readAsDataURL(file);
}

function initializeCroppie(img) {
    if (croppieInstance) {
        croppieInstance.destroy();
    }
    croppieInstance = new Croppie(img, {
        viewport: { width: 200, height: 200, type: currentShape },
        boundary: { width: 300, height: 300 },
        showZoomer: true,
    });
}

function destroyCroppie() {
    if (croppieInstance) {
        croppieInstance.destroy();
        croppieInstance = null;  // S'assurer que l'instance est bien supprimée
    }
}

toggleCropButton.addEventListener('click', () => {
    cropEnabled = !cropEnabled;
    toggleCropButton.textContent = cropEnabled ? 'Désactiver le Recadrage' : 'Activer le Recadrage';

    const img = imgContainer.querySelector('img');
    if (img) {
        if (cropEnabled) {
            initializeCroppie(img);  // Activer le recadrage
        } else {
            destroyCroppie();  // Désactiver le recadrage
        }
    }
});

toggleShapeButton.addEventListener('click', () => {
    currentShape = currentShape === 'circle' ? 'square' : 'circle';
    toggleShapeButton.textContent = currentShape === 'circle' ? 'Basculer en Carré' : 'Basculer en Cercle';

    if (cropEnabled && croppieInstance) {
        const img = imgContainer.querySelector('img');
        initializeCroppie(img);
    }
});

downloadButton.removeEventListener('click', () => downloadCroppedImage(currentShape)); // Supprimez cette ligne

downloadButton.addEventListener('click', () => downloadCroppedImage(currentShape));

function downloadCroppedImage(shape) {
    if (croppieInstance) {
        croppieInstance.result({
            type: 'base64',
            size: { width: 200, height: 200 },
            format: 'png',
            circle: shape === 'circle'
        }).then((base64) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                const canvas = getFilteredCanvas(img);
                canvas.toBlob((blob) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `cropped-image-${shape}.png`;
                    link.click();
                }, 'image/png');
            };
        });
    } else {
        const img = imgContainer.querySelector('img');
        if (img) {
            const canvas = getFilteredCanvas(img);
            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'image.png';
                link.click();
            }, 'image/png');
        }
    }
}

function getFilteredCanvas(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    // Appliquer les filtres
    ctx.filter = `brightness(${brightnessInput.value}) contrast(${contrastInput.value}) saturate(${saturationInput.value})`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas;
}