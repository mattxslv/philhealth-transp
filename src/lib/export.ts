/**
 * Utility functions for exporting data in various formats
 */

/**
 * Convert array of objects to CSV format
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  // Get headers from first object keys if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create header row
  const headerRow = csvHeaders.join(",");

  // Create data rows
  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header];
        // Handle values that contain commas, quotes, or newlines
        if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: any[], filename: string, headers?: string[]) {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert array of objects to Excel XML format
 */
export function convertToExcelXML(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  const csvHeaders = headers || Object.keys(data[0]);
  
  let xml = `<?xml version="1.0"?>\n`;
  xml += `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n`;
  xml += `<Worksheet ss:Name="Sheet1">\n`;
  xml += `<Table>\n`;

  // Header row
  xml += `<Row>\n`;
  csvHeaders.forEach(header => {
    xml += `<Cell><Data ss:Type="String">${header}</Data></Cell>\n`;
  });
  xml += `</Row>\n`;

  // Data rows
  data.forEach(row => {
    xml += `<Row>\n`;
    csvHeaders.forEach(header => {
      const value = row[header];
      const dataType = typeof value === 'number' ? 'Number' : 'String';
      xml += `<Cell><Data ss:Type="${dataType}">${value ?? ''}</Data></Cell>\n`;
    });
    xml += `</Row>\n`;
  });

  xml += `</Table>\n`;
  xml += `</Worksheet>\n`;
  xml += `</Workbook>`;

  return xml;
}

/**
 * Download data as Excel XLS file
 */
export function downloadXLS(data: any[], filename: string, headers?: string[]) {
  const xml = convertToExcelXML(data, headers);
  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print current page or specific element
 */
export function printPage(elementId?: string) {
  if (elementId) {
    const printContents = document.getElementById(elementId)?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore event listeners
    }
  } else {
    window.print();
  }
}

/**
 * Copy data to clipboard as JSON
 */
export async function copyToClipboard(data: any): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Format financial data for export
 */
export function formatFinancialDataForExport(data: any) {
  return {
    year: data.year,
    revenue: data.revenue,
    expenditures: data.expenditures,
    netIncome: data.netIncome,
    totalAssets: data.totalAssets,
    totalLiabilities: data.totalLiabilities,
    fundBalance: data.fundBalance,
    beneficiaries: data.beneficiaries || data.totalBeneficiaries,
    claimsCount: data.claimsCount,
    claimsPaid: data.claimsPaid,
  };
}

/**
 * Format facility data for export
 */
export function formatFacilityDataForExport(facilities: any[]) {
  return facilities.map((facility) => ({
    name: facility.name,
    type: facility.type,
    region: facility.region,
    city: facility.city,
    category: facility.category,
    status: facility.status,
    beds: facility.beds,
    accreditationDate: facility.accreditationDate,
  }));
}

/**
 * Format claims data for export
 */
export function formatClaimsDataForExport(claims: any) {
  return {
    totalClaims: claims.totalClaims,
    totalAmountPaid: claims.totalAmountPaid,
    averageProcessingDays: claims.averageProcessingDays,
    benefitExpense: claims.benefitExpense,
  };
}
