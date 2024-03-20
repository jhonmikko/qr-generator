// Selecting elements from the DOM
const download = document.querySelector(".download");
const dark = document.querySelector(".dark");
const light = document.querySelector(".light");
const qrContainer = document.querySelector("#qr-code");
const qrText = document.querySelector(".qr-text");
const shareBtn = document.querySelector(".share-btn");
const sizes = document.querySelector(".sizes");

// Adding event listeners to elements
dark.addEventListener("input", handleDarkColor);
light.addEventListener("input", handleLightColor);
qrText.addEventListener("input", handleQRText);
sizes.addEventListener("click", handleSize);
shareBtn.addEventListener("click", handleShare);

// Default values
const defaultUrl = "https://www.google.com/";
let colorLight = "#fff",
    colorDark = "#000",
    text = defaultUrl,
    size = 300;

// Event handlers
function handleDarkColor(e){
    colorDark = e.target.value;
    generateQRCode();
}

function handleLightColor(e){
    colorLight = e.target.value;
    generateQRCode();
}

function handleQRText(e){
    const value = e.target.value;
    text = value;
    if(!value){
        text = defaultUrl;
    }
    generateQRCode();
}

async function generateQRCode(){
    // Clearing previous QR code
    qrContainer.innerHTML = "";
    // Generating new QR code
    new QRCode("qr-code", {
        text, 
        height: size,
        width: size,
        colorLight,
        colorDark,
    });
    // Setting download link href attribute
    download.href = await resolveDataUrl();
}

async function handleShare(){
    // Handling sharing functionality
    setTimeout(async () => {
        try{
            const base64Url = await resolveDataUrl();
            const blob = await (await fetch(base64Url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            // Sharing file
            await navigator.share({
                files: [file],
                title: text,
            })
        }catch(error){
            // Alerting if sharing is not supported
            alert("Your browser does not support sharing.");
        }
    }, 100);
}

function handleSize(e){
    // Handling size change
    size = e.target.value;
    generateQRCode();
}

// Function to resolve data URL for QR code image
function resolveDataUrl(){
    return new Promise((resolve, reject) => {
        const img = document.querySelector("#qr-code img");
        if(img.currentSrc){
            resolve(img.currentSrc);
            return;
        }
        const canvas = document.querySelector("canvas");
        resolve(canvas.toDataURL());
    }, 50);
};

// Generating initial QR code
generateQRCode();
