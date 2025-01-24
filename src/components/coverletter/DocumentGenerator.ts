import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

export class DocumentGenerator {
  static async generate(fileType: string, htmlContent: string): Promise<void> {
    const container = this.createContainer(htmlContent);

    switch (fileType) {
      case "pdf":
        await this.generatePDF(container);
        break;
      case "docx":
        await this.generateDOCX(container);
        break;
      default:
        document.body.removeChild(container);
        window.close();
    }

    document.body.removeChild(container);
  }

  private static createContainer(htmlContent: string): HTMLDivElement {
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    return container;
  }

  private static async generatePDF(container: HTMLDivElement): Promise<void> {
    const doc = new jsPDF({
      unit: "pt",
      format: "letter",
      hotfixes: ["px_scaling"],
    });

    return new Promise((resolve) => {
      doc.html(container, {
        callback: function (doc) {
          doc.save("cover-letter.pdf");
          resolve();
        },
        margin: [40, 40, 40, 40],
        autoPaging: "text",
        x: 0,
        y: 0,
        width: 535,
        windowWidth: 800,
      });
    });
  }

  private static async generateDOCX(container: HTMLDivElement): Promise<void> {
    const paragraphs = this.convertHtmlToDocxContent(container.innerHTML);
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    await this.downloadFile(blob, "cover-letter.docx");
  }

  private static convertHtmlToDocxContent(htmlString: string): Paragraph[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const paragraphs: Paragraph[] = [];

    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const text = element.textContent || "";

        if (element.tagName === "B") {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text, bold: true })],
            })
          );
        } else if (element.tagName === "P") {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: text.replace(/\n/g, " ") })],
              spacing: { after: 300 },
            })
          );
        }
      }
    });

    return paragraphs;
  }

  private static async downloadFile(
    blob: Blob,
    filename: string
  ): Promise<void> {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}
