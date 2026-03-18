import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportWaitlistToPdf = (entries: any[]) => {
  const doc = new jsPDF();
  
  doc.text("Kiwiko Waitlist", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
  
  const tableColumn = ["#", "Email", "Source", "Joined At"];
  const tableRows: any[][] = [];

  entries.forEach((entry, index) => {
    const rowData = [
      index + 1,
      entry.email,
      entry.source || "Direct",
      new Date(entry.joinedAt).toLocaleDateString()
    ];
    tableRows.push(rowData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [249, 115, 22] } // orange-500
  });

  doc.save("kiwiko-waitlist.pdf");
};
