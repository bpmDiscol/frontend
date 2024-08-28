import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const exportMultipleToPDF = async (refs_) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const refs = refs_.filter(
    (ref) => ref.current && ref.current.innerHTML.trim() !== ""
  );

  for (let i = 0; i < refs.length; i++) {
    const input = refs[i].current;

    // Convierte el elemento HTML a un canvas usando html2canvas
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Agrega la imagen al PDF
    console.log(typeof imgData)
    if (imgData) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Añadir una nueva página si no es el último componente
      if (i < refs.length - 1) {
        pdf.addPage();
      }
    }
  }

  // Guardar el PDF
  pdf.save("combined.pdf");
};

export default exportMultipleToPDF;
