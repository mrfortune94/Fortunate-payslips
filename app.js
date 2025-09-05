document.getElementById('payslipForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  document.getElementById('error').textContent = '';

  try {
    const { jsPDF } = window.jspdf;
    const zip = new JSZip();

    // Get Inputs
    const companyName = document.getElementById('companyName').value.trim();
    const abn = document.getElementById('abn').value.trim();
    const address = document.getElementById('address').value.trim();
    const superRate = parseFloat(document.getElementById('superRate').value) / 100;

    const empName = document.getElementById('empName').value.trim();
    const empID = document.getElementById('empID').value.trim();
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const hoursWorked = parseFloat(document.getElementById('hoursWorked').value);
    const overtimeHours = parseFloat(document.getElementById('overtimeHours').value);
    const overtimeRate = parseFloat(document.getElementById('overtimeRate').value);

    let [annualLeave, sickLeave] = document.getElementById('leaveBalances').value.split(',').map(Number);

    let startDate = new Date(document.getElementById('startDate').value);

    // Basic validation
    if (!companyName || !abn || !address || isNaN(superRate) ||
        !empName || !empID || isNaN(hourlyRate) || isNaN(hoursWorked) ||
        isNaN(overtimeHours) || isNaN(overtimeRate) || isNaN(annualLeave) || isNaN(sickLeave) ||
        isNaN(startDate.getTime())) {
      document.getElementById('error').textContent = 'Check all inputs; some are missing or invalid.';
      return;
    }

    for(let week=1; week<=52; week++){
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // Tuesday-to-Tuesday period

      // Calculations
      const gross = (hoursWorked * hourlyRate) + (overtimeHours * overtimeRate);
      const superAmount = gross * superRate;
      const payg = calculateWeeklyPAYG(gross);
      const netPay = gross - superAmount - payg;

      // Leave accruals
      annualLeave += gross * 0.0154; // weekly accrual approx 4 weeks/year
      sickLeave += gross * 0.0385/12; // 10 days/year approx

      // Generate PDF
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text(`EMPLOYEE PAYSLIP`, 20, 20);
      doc.text(`Company: ${companyName}`, 20, 30);
      doc.text(`ABN: ${abn}`, 20, 36);
      doc.text(`Address: ${address}`, 20, 42);
      doc.text(`Employee: ${empName} (ID: ${empID})`, 20, 54);
      doc.text(`Pay Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 20, 60);

      doc.text(`Hours Worked: ${hoursWorked}`, 20, 72);
      doc.text(`Hourly Rate: $${hourlyRate.toFixed(2)}`, 20, 78);
      doc.text(`Overtime: ${overtimeHours} @ $${overtimeRate.toFixed(2)}`, 20, 84);
      doc.text(`Gross Pay: $${gross.toFixed(2)}`, 20, 96);
      doc.text(`PAYG: $${payg.toFixed(2)}`, 20, 102);
      doc.text(`Super (${(superRate*100).toFixed(1)}%): $${superAmount.toFixed(2)}`, 20, 108);
      doc.text(`Net Pay: $${netPay.toFixed(2)}`, 20, 114);

      doc.text(`Annual Leave Balance: $${annualLeave.toFixed(2)}`, 20, 126);
      doc.text(`Sick Leave Balance: $${sickLeave.toFixed(2)}`, 20, 132);

      // Add PDF to ZIP
      const pdfBlob = doc.output('blob');
      zip.file(`Payslip_Week${week}.pdf`, pdfBlob);

      // Next week
      startDate.setDate(startDate.getDate() + 7);
    }

    // Generate ZIP and download
    const zipBlob = await zip.generateAsync({type:'blob'});
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${empName}_Payslips_Year.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('52 weekly payslips generated and downloaded as ZIP!');
  } catch (err) {
    document.getElementById('error').textContent = 'An error occurred: ' + err.message;
  }
});

// Approximate weekly PAYG calculation for simplicity
function calculateWeeklyPAYG(gross){
  const annualised = gross * 52;
  let tax = 0;
  if(annualised <= 18200) tax = 0;
  else if(annualised <= 45000) tax = (annualised-18200)*0.19;
  else if(annualised <= 120000) tax = 5092+(annualised-45000)*0.325;
  else if(annualised <= 180000) tax = 29467+(annualised-120000)*0.37;
  else tax = 51667+(annualised-180000)*0.45;
  return tax/52; // weekly PAYG
