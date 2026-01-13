import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper';
import { Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Resume = () => {
  return (
    <>
      <div className="window-header">
        <WindowControls target="resume" />
        <h2>Resume.pdf</h2>

        <a
          href="/files/Manicsresume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="pointer"
        >
          <Download className="icon" />
        </a>
      </div>

      <Document
        file="/files/Manicsresume.pdf"
        loading={<p>Loading PDF…</p>}
        error={<p>Failed to load PDF.</p>}
      >
        <Page
          pageNumber={1}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Document>
    </>
  );
};

const ResumeWindow = WindowWrapper(Resume, 'resume');
export default ResumeWindow;
