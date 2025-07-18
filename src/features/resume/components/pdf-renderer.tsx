'use client';

import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { TResumeEditFormValues } from '../utils/form-schema';
import { getTemplate } from '../templates/registry';
import { Icons } from '@/components/icons';
import { useAsync } from 'react-use';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

type TPdfRendererProps = {
  formData: TResumeEditFormValues;
  templateId: string;
};

const PdfRenderer = ({ formData, templateId }: TPdfRendererProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousRenderValue, setPreviousRenderValue] = useState<string | null>(
    null
  );

  const template = getTemplate(templateId);
  const Template = template?.component;

  const render = useAsync(async () => {
    if (!formData || !Template) return null;

    const blob = await pdf(<Template formData={formData} />).toBlob();
    const url = URL.createObjectURL(blob);

    return url;
  }, [formData, Template]);

  const onPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const onNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const onDocumentLoad = (d: { numPages: number }) => {
    setNumPages(d.numPages);
    setCurrentPage((prev) => Math.min(prev, d.numPages));
  };

  const isFirstRendering = !previousRenderValue;
  const isLatestValueRendered = previousRenderValue === render.value;
  const isBusy = render.loading || !isLatestValueRendered;
  const shouldShowTextLoader = isFirstRendering && isBusy;
  const shouldShowPreviousDocument = !isFirstRendering && isBusy;

  function generateDownloadFilename() {
    const timestamp = new Date().getTime();
    return `next-resume-${timestamp}.pdf`;
  }

  if (!Template) {
    return <div>Template not found</div>;
  }

  return (
    <div className='relative flex h-full flex-1 flex-col'>
      {shouldShowPreviousDocument && previousRenderValue ? (
        <Document
          key={previousRenderValue}
          className='opacity-50'
          file={previousRenderValue}
          loading={null}
        >
          <Page key={currentPage} pageNumber={currentPage} />
        </Document>
      ) : null}
      <div id='resume-pdf-preview'>
        <Document
          key={render.value}
          className={shouldShowPreviousDocument ? 'absolute' : undefined}
          file={render.value}
          loading={null}
          onLoadSuccess={onDocumentLoad}
        >
          <Page
            key={currentPage}
            pageNumber={currentPage}
            onRenderSuccess={() => setPreviousRenderValue(render.value!)}
          />
        </Document>
      </div>
      <div className='my-4'>
        {numPages && numPages > 0 && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Button
                size={'sm'}
                onClick={onPreviousPage}
                disabled={currentPage <= 1}
                className='disabled:opacity-50'
              >
                <Icons.chevronLeft className='h-4 w-4' />
              </Button>
              <span className='text-primary'>
                Page {currentPage} of {numPages}
              </span>
              <Button
                size={'sm'}
                onClick={onNextPage}
                disabled={currentPage >= numPages}
                className='disabled:opacity-50'
              >
                <Icons.chevronRight className='h-4 w-4' />
              </Button>
            </div>
            {render.value && (
              <Button asChild>
                <a
                  href={render.value!}
                  download={generateDownloadFilename()}
                  className='text-primary'
                >
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfRenderer;
