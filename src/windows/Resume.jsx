import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper';
import { Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';

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

                <a href='files/resume.pdf' target='_blank' download className='pointer' >
                    <Download className='icon' />
                </a>
            </div>
            <Document file="files/resume.pdf" >
                <Page
                    pageNumber={1}
                    renderTextLayer
                    renderAnnotationLayer />
            </Document>

        </>
    )
}


const ResumeWindow = WindowWrapper(Resume, 'resume');
export default ResumeWindow;