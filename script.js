document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const vehicleInput = document.getElementById('vehicleInput');
    const fuelTypeInput = document.getElementById('fuelTypeInput');

    const cardName = document.getElementById('cardName');
    const cardVehicle = document.getElementById('cardVehicle');
    const cardFuelType = document.getElementById('cardFuelType');
    
    // QR Code visual elements
    const qrcodeElement = document.getElementById("qrcode");
    const uploadedQrImg = document.getElementById("uploadedQrImg");
    const qrUploadInput = document.getElementById("qrUpload");
    
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
        };
        reader.readAsDataURL(file);
    });

    // ==========================================
    // Print and Download Logic
    // ==========================================
    const passCard = document.getElementById('passCard');
    
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
            backgroundColor: '#1e1e1e', // Match CSS dark background
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
            backgroundColor: '#1e1e1e',
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
