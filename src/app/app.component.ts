import { Component } from "@angular/core";
import PSPDFKit from "pspdfkit";

@Component({
selector: "app-root",
templateUrl: "./app.component.html",
styleUrls: ["app.component.css"]
})
export class AppComponent {
	title = "PSPDFKit for Web Angular Example";
  pdf: any;

	ngAfterViewInit() {
		PSPDFKit.load({
			// Use the assets directory URL as a base URL. PSPDFKit will download its library assets from here.
			baseUrl: location.protocol + "//" + location.host + "/assets/",
			document: "/assets/example.pdf",
			container: "#pspdfkit-container",
		}).then(instance => {
			// For the sake of this demo, store the PSPDFKit for Web instance
			// on the global object so that you can open the dev tools and
			// play with the PSPDFKit API.

			//(window as any).instance = instance;
			this.pdf = instance;
		});
	}

  downloadPdf(blob) {
    const a = document.createElement("a");
    a.href = blob;
    a.style.display = "none";
    a.download = "download.pdf";
    a.setAttribute("download", "download.pdf");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  save() {
    this.pdf.exportPDF().then(buffer =>{
      console.log(buffer);
      const supportsDownloadAttribute = HTMLAnchorElement.prototype.hasOwnProperty("download");
        const blob = new Blob([buffer], { type: "application/pdf" });
  
        if ( navigator.msSaveOrOpenBlob ) {
          navigator.msSaveOrOpenBlob(blob, "download.pdf");
        } else if (!supportsDownloadAttribute) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result;
            this.downloadPdf(dataUrl);
          };
          reader.readAsDataURL(blob);
        } else {
          const objectUrl = window.URL.createObjectURL(blob);
          this.downloadPdf(objectUrl);
          window.URL.revokeObjectURL(objectUrl);
        }
    });
  }
}