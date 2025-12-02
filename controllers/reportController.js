const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const userService = require("../services/userService");

class ReportController {
  async generateUsersReport(req, res) {
    try {
      const users = await userService.getAllUsers();

      // Load templates
      const headerTemplate = fs.readFileSync(path.join(__dirname, "../templates/header.html"), "utf8");
      const footerTemplate = fs.readFileSync(path.join(__dirname, "../templates/footer.html"), "utf8");
      const reportTemplate = fs.readFileSync(path.join(__dirname, "../templates/usersReport.html"), "utf8");

      // Build table rows
      const rows = users.map(u => `
        <tr>
          <td style="border:1px solid #ddd; padding:8px;">${u.id}</td>
          <td style="border:1px solid #ddd; padding:8px;">${u.name}</td>
          <td style="border:1px solid #ddd; padding:8px;">${u.email}</td>
        </tr>
      `).join("");

      // Replace placeholders
      const html = reportTemplate
        .replace("{{header}}", headerTemplate)
        .replace("{{footer}}", footerTemplate)
        .replace("{{rows}}", rows);

      // Launch Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: false, // we handle header/footer in HTML
        margin: { top: "60px", bottom: "60px" }
      });

      await browser.close();

      // Send PDF
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=users_report.pdf"
      });
      res.send(pdfBuffer);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate report" });
    }
  }
}

module.exports = new ReportController();
