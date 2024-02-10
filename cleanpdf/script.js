// 引入pdf-lib庫
const { PDFDocument } = PDFLib;

async function handleUpload() {
    const fileInput = document.getElementById('pdfInput');
    const convertButton = document.getElementById('convertButton');

    // 確認使用者已選擇PDF檔案
    if (fileInput.files.length > 0) {
        const pdfFile = fileInput.files[0];

        // 顯示轉換按鈕
        convertButton.style.display = 'block';

        // 儲存PDF檔案的位元組數組
        convertButton.pdfFile = pdfFile;
    }
}

async function convertToImageAndBack() {
    const convertButton = document.getElementById('convertButton');

    // 讀取PDF檔案的位元組數組
    const pdfFile = convertButton.pdfFile;
    const pdfBytes = await readFileAsArrayBuffer(pdfFile);

    // 使用pdf-lib創建PDF文件
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // 將PDF轉換為圖片
    const imageUrls = await convertPDFToImages(pdfBytes);

    // 將圖片轉換為PDF
    const newPdfBytes = await convertImagesToPDF(imageUrls);

    // 將新的PDF檔案提供給使用者下載
    downloadPDF(newPdfBytes, 'converted_pdf.pdf');
}

async function convertPDFToImages(pdfBytes) {
    const pdf = await pdfjs.getDocument(new Uint8Array(pdfBytes)).promise;

    const imageUrls = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const imageUrl = canvas.toDataURL('image/png');
        imageUrls.push(imageUrl);
    }

    return imageUrls;
}

async function convertImagesToPDF(imageUrls) {
    const newPdfDoc = await PDFDocument.create();

    for (const imageUrl of imageUrls) {
        const imageBytes = await fetch(imageUrl).then(response => response.arrayBuffer());
        const [imagePage] = await newPdfDoc.copyPages(await PDFDocument.create(), [0]);
        const image = await newPdfDoc.embedPng(imageBytes);
        imagePage.drawImage(image, { x: 0, y: 0 });
        newPdfDoc.addPage(imagePage);
    }

    return await newPdfDoc.save();
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

function downloadPDF(pdfBytes, fileName) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}
