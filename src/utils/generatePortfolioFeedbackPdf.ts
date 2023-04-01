import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import "jspdf-autotable";
import { callAddFontPoppinsNormal } from "./Poppins-Regular-normal";
import { callAddFont } from "./Poppins-SemiBold-normal";
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns";

// define a generatePDF function that accepts a tickets argument
const generatePortfolioFeedbackPDF = (
  holdings: any[],
  diversificationFeedback: string,
  recommendedStocksFeedback: string,
  riskAssessmentFeedback: string,
  summaryFeedback: string
) => {
  jsPDF.API.events.push(["addFonts", callAddFont, callAddFontPoppinsNormal]);

  const doc = new jsPDF();

  const tableRows: any = [];

  holdings.forEach(holding => {
    const holdingData = [
      holding.ticker,
      holding.allocation + '%',
    ];
    tableRows.push(holdingData);
  });

  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

  // PAGE 1

  // HEADER
  doc.setFont('Poppins-SemiBold', 'normal')
  doc.setTextColor(102, 102, 255)
  doc.setFontSize(30);
  doc.text("PortfolioBot", 20, 20)
  doc.setTextColor(0, 0, 0)

  // TODO: Displayer Investor Info

  // autoTable(doc, {
  //   head: [['Stock', 'Allocation']],
  //   body: tableRows,
  //   startY: 70, 
  // })

  // doc.addPage()

  // DIVERSIFICATION
  // TODO: make this bolder
  doc.setFont('Poppins-SemiBold', 'normal')
  doc.setFontSize(20);
  doc.text("Diversification", 20, 30)

  doc.setFontSize(12);
  const diversificationFeedbackText = doc.splitTextToSize(diversificationFeedback, 160);

  doc.setFont('Poppins-Regular', 'normal')
  doc.text(diversificationFeedbackText, 20, 40)

  // PAGE 2
  doc.addPage()

  // RECOMMENDED STOCKS
  doc.setFont('Poppins-SemiBold', 'normal')
  doc.setFontSize(20);
  doc.text("Stock Recommendations", 20, 20)
  
  doc.setFont('Poppins-Regular', 'normal')
  doc.setFontSize(12);
  const recommendedStocksText = doc.splitTextToSize(recommendedStocksFeedback, 160);
  doc.text(recommendedStocksText, 20, 30)

  doc.addPage()

  // RISK ASSESSMENT
  doc.setFont('Poppins-SemiBold', 'normal')
  doc.setFontSize(20);
  doc.text("Risk Assessment", 20, 20)

  doc.setFont('Poppins-Regular', 'normal')
  doc.setFontSize(12);
  const riskAssessmentText = doc.splitTextToSize(riskAssessmentFeedback, 160);
  doc.text(riskAssessmentText, 20, 30)

  doc.addPage()
  
  // SUMMARY
  doc.setFont('Poppins-SemiBold', 'normal')
  doc.setFontSize(20);
  doc.text("Summary", 20, 20)

  doc.setFont('Poppins-Regular', 'normal')
  doc.setFontSize(12);
  const summaryText = doc.splitTextToSize(summaryFeedback, 160);
  doc.text(summaryText, 20, 30)

  // SAVE
  doc.save(`portfolio_bot_report_${dateStr}.pdf`)
};

export default generatePortfolioFeedbackPDF;
