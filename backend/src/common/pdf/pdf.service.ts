import { Injectable } from "@nestjs/common";
// import { readFileSync, writeFileSync } from "fs";
// import { getDocument } from "pdfjs-dist";
// import { TextItem } from "pdfjs-dist/types/src/display/api";

@Injectable()
export class PdfService {
  async extractPdf(path: string): Promise<void> {
    // try {
    //   const pdfData = new Uint8Array(readFileSync(path));
    //   const pdfDocument = await getDocument({ data: pdfData }).promise;

    //   let content = "";

    //   for (let index = 1; index <= pdfDocument.numPages; index++) {
    //     const page = await pdfDocument.getPage(index);

    //     const textContent = await page.getTextContent();
    //     const items: Array<{ text: string; x: number; y: number }> = (
    //       textContent.items as Array<TextItem>
    //     ).map((item) => {
    //       const x = Number(item.transform[4]);
    //       const y = Number(item.transform[5]);
    //       return {
    //         text: String(item.str),
    //         x: x,
    //         y: y,
    //       };
    //     });

    //     items.sort((a, b) => {
    //       if (b.y === a.y) {
    //         return a.x - b.x;
    //       }
    //       return b.y - a.y;
    //     });

    //     const lines: Array<string> = [];
    //     let currentLine: Array<string> = [];
    //     let lastY: number | null = null;

    //     items.forEach((item) => {
    //       if (lastY === null || Math.abs(lastY - item.y) < 5) {
    //         currentLine.push(item.text);
    //       } else {
    //         lines.push(currentLine.join(""));
    //         currentLine = [item.text];
    //       }
    //       lastY = item.y;
    //     });

    //     if (currentLine.length > 0) {
    //       lines.push(currentLine.join(""));
    //     }
    //     content += lines.join("\n");
    //   }
    //   writeFileSync("./output.txt", content);
    // } catch (error) {
    //   console.error("Error loading PDF:", error);
    // }
  }
}
