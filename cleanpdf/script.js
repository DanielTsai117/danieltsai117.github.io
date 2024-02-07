// 引入pdf-lib庫
const { PDFDocument } = PDFLib;

async function handleUpload() {
    const fileInput = document.getElementById('pdfInput');
    const printButton = document.getElementById('printButton');

    // 確認使用者已選擇PDF檔案
    if (fileInput.files.length > 0) {
        const pdfFile = fileInput.files[0];

        // 讀取PDF檔案
        const pdfBytes = await readFileAsArrayBuffer(pdfFile);

        // 顯示打印按鈕
        printButton.style.display = 'block';

        // 儲存PDF檔案的位元組數組
        printButton.pdfBytes = pdfBytes;
    }
}

async function handlePrint() {
    const printButton = document.getElementById('printButton');

    // 讀取PDF檔案的位元組數組
    const pdfBytes = printButton.pdfBytes;

    // 使用pdf-lib創建PDF文件
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // 創建新的PDF檔案（這只是一個示例，您可以根據需要修改）
    const newPdfDoc = await PDFDocument.create();
    const [newPage] = await newPdfDoc.copyPages(pdfDoc, [0]);
    newPdfDoc.addPage(newPage);

    // 將新的PDF檔案轉換為二進位數組
    const newPdfBytes = await newPdfDoc.save();

    // 將新的PDF檔案提供給使用者下載
    downloadPDF(newPdfBytes, 'printed_pdf.pdf');
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