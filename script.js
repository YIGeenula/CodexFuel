document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const vehicleInput = document.getElementById('vehicleInput');
    const fuelTypeInput = document.getElementById('fuelTypeInput');

    const cardName = document.getElementById('cardName');
    const cardVehicle = document.getElementById('cardVehicle');
    const cardFuelType = document.getElementById('cardFuelType');
    
    // Design Elements
    const bgColorInput = document.getElementById('bgColorInput');
    const textColorInput = document.getElementById('textColorInput');
    const labelColorInput = document.getElementById('labelColorInput');
    const accentColorInput = document.getElementById('accentColorInput');
    const qrBgColorInput = document.getElementById('qrBgColorInput');
    const borderColorInput = document.getElementById('borderColorInput');
    const borderRadiusInput = document.getElementById('borderRadiusInput');
    const borderOpacityInput = document.getElementById('borderOpacityInput');

    const borderRadiusValue = document.getElementById('borderRadiusValue');
    const borderOpacityValue = document.getElementById('borderOpacityValue');

    const passCard = document.getElementById('passCard');
    const qrContainer = document.querySelector('.qr-container');
    const labels = document.querySelectorAll('.detail-item .label');
    const values = document.querySelectorAll('.detail-item .value');
    const logoSvg = document.querySelector('.logo svg');
    const logoText = document.querySelector('.logo span');
    const idNumber = document.querySelector('.id-number');
    
    // QR Code visual elements
    const qrcodeElement = document.getElementById("qrcode");
    const uploadedQrImg = document.getElementById("uploadedQrImg");
    const qrUploadInput = document.getElementById("qrUpload");
    
    // QR Adjustments
    const qrAdjustmentControls = document.getElementById("qrAdjustmentControls");
    const qrScaleInput = document.getElementById("qrScaleInput");
    const qrScaleValue = document.getElementById("qrScaleValue");
    const qrXInput = document.getElementById("qrXInput");
    const qrYInput = document.getElementById("qrYInput");
    const resetQrBtn = document.getElementById("resetQrBtn");
    
    // Setup initial default generative QR Code
    let qrcode = new QRCode(qrcodeElement, {
        text: "init",
        width: 130,
        height: 130,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    let usingCustomQR = false; 

    // Generate JSON string strictly for the QR content locally without displaying an ID string
    function generateQRData() {
        const data = {
            name: nameInput.value || 'John Doe',
            vehicle: vehicleInput.value || 'WP ABC-1234',
            fuel: fuelTypeInput.value || 'Petrol 92',
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(data);
    }

    function updateCard() {
        cardName.textContent = nameInput.value || 'John Doe';
        cardVehicle.textContent = vehicleInput.value || 'WP ABC-1234';
        
        const fuel = fuelTypeInput.value;
        cardFuelType.textContent = fuel;
        
        if(fuel.includes('Petrol')) {
            cardFuelType.style.color = 'var(--petrol)';
            cardFuelType.style.textShadow = '0 0 10px rgba(234, 179, 8, 0.5)';
        } else {
            cardFuelType.style.color = 'var(--diesel)';
            cardFuelType.style.textShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
        }

        if (!usingCustomQR) {
            qrcode.clear();
            qrcode.makeCode(generateQRData());
        }
    }

    // Input Event Listeners
    nameInput.addEventListener('input', updateCard);
    vehicleInput.addEventListener('input', updateCard);
    fuelTypeInput.addEventListener('change', updateCard);

    // Initial styling
    updateCard();
    
    // ==========================================
    // Design Customisation Logic
    // ==========================================
    function hexToRgba(hex, opacity) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    function updateDesign() {
        passCard.style.backgroundColor = bgColorInput.value;
        passCard.style.borderRadius = `${borderRadiusInput.value}px`;
        borderRadiusValue.textContent = `${borderRadiusInput.value}px`;
        
        qrContainer.style.backgroundColor = qrBgColorInput.value;
        qrContainer.style.borderRadius = `${Math.max(borderRadiusInput.value * 0.75, 4)}px`;

        // Text Colors
        logoText.style.color = textColorInput.value;
        values.forEach(val => val.style.color = textColorInput.value);
        labels.forEach(lbl => lbl.style.color = labelColorInput.value);
        
        logoSvg.style.color = accentColorInput.value;
        idNumber.style.color = textColorInput.value;
        
        let opacity = borderOpacityInput.value / 100;
        borderOpacityValue.textContent = `${borderOpacityInput.value}%`;
        passCard.style.borderColor = hexToRgba(borderColorInput.value, opacity);
        
        // Ensure fuel color overrides text color for fuel value
        updateCard();
    }

    [bgColorInput, textColorInput, labelColorInput, accentColorInput, qrBgColorInput, borderColorInput, borderRadiusInput, borderOpacityInput].forEach(el => {
        el.addEventListener('input', updateDesign);
    });

    updateDesign();
    
    // ==========================================
    // QR Image Upload Logic (In Browser Memory)
    // ==========================================
    qrUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const rawDataUrl = e.target.result;
            
            uploadedQrImg.src = rawDataUrl;
            uploadedQrImg.style.display = 'block';
            qrcodeElement.style.display = 'none';
            usingCustomQR = true;
            qrAdjustmentControls.style.display = 'block';
            updateQrTransform();
        };
        reader.readAsDataURL(file);
    });

    // QR Image Adjustment Logic
    function updateQrTransform() {
        const scale = qrScaleInput.value / 100;
        const x = qrXInput.value;
        const y = qrYInput.value;
        
        qrScaleValue.textContent = `${qrScaleInput.value}%`;
        uploadedQrImg.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    [qrScaleInput, qrXInput, qrYInput].forEach(el => {
        el.addEventListener('input', updateQrTransform);
    });

    resetQrBtn.addEventListener('click', () => {
        qrScaleInput.value = 100;
        qrXInput.value = 0;
        qrYInput.value = 0;
        updateQrTransform();
    });

    // ==========================================
    // Print and Download Logic
    // ==========================================
    
    function resetTransformForCapture() {
        passCard.style.transform = 'none';
        passCard.style.transition = 'none';
    }
    function restoreTransform() {
        passCard.style.transition = 'transform 0.5s ease';
    }

    document.getElementById('downloadImageBtn').addEventListener('click', async () => {
        resetTransformForCapture();
        
        const canvas = await html2canvas(passCard, {
            scale: 3, 
            backgroundColor: bgColorInput.value, // Match chosen dark background
            useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `CodeXFuel-Pass-${(nameInput.value || 'John Doe').replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        restoreTransform();
    });

    document.getElementById('downloadPdfBtn').addEventListener('click', async () => {
        resetTransformForCapture();
        
        const canvas = await html2canvas(passCard, {
            scale: 3,
            backgroundColor: bgColorInput.value,
            useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Portrait, Inches, 2.125 x 3.375
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [2.125, 3.375]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, 2.125, 3.375);
        pdf.save(`CodeXFuel-Pass-${(nameInput.value || 'John Doe').replace(/\s+/g, '-')}.pdf`);
        
        restoreTransform();
    });

    // ==========================================
    // Interactive 3D Tilt Effect on Desktop
    // ==========================================
    passCard.addEventListener('mousemove', (e) => {
        const rect = passCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        
        passCard.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    passCard.addEventListener('mouseleave', () => {
        passCard.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
    });
});
