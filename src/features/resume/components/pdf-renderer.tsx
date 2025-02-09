'use client';

import { Icons } from '@/components/icons';
import { BlobProvider } from '@react-pdf/renderer';
import { memo, useState, useEffect } from 'react';
import { Document, Page, pdfjs, usePageContext } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { getTemplate } from '../templates/registry';
import { TResumeEditFormValues } from '../utils/form-schema';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

type TPdfRendererProps = {
  formData: TResumeEditFormValues;
  templateId: string;
};

const PdfRenderer = memo(
  ({ formData, templateId }: TPdfRendererProps) => {
    const template = getTemplate(templateId);
    const Template = template?.component;
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [url, setUrl] = useState<string | null>(null);

    // Cleanup effect
    useEffect(() => {
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }, [url]);

    if (!Template) {
      return <FallBackLoader />;
    }

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
      setNumPages(numPages);
    }

    function onPrevPage(): void {
      setPageNumber((prev) => (prev - 1 > 1 ? prev - 1 : 1));
    }

    function onNextPage(): void {
      setPageNumber((prev) => (prev + 1 > numPages! ? numPages! : prev + 1));
    }

    function FallBackLoader() {
      return (
        <div className='flex items-center justify-center'>
          <Icons.spinner className='h-6 w-6 animate-spin' />
        </div>
      );
    }

    function generateDownloadFilename() {
      const timestamp = new Date().getTime();
      return `next-resume-${timestamp}.pdf`;
    }

    return (
      <div className='relative'>
        <BlobProvider
          key={`${templateId}-${JSON.stringify(formData)}`}
          document={<Template formData={formData} />}
        >
          {({ blob, url: pdfUrl, loading, error }) => {
            if (loading || !pdfUrl) {
              return <FallBackLoader />;
            }

            if (error) {
              return <div>Error generating PDF</div>;
            }

            return (
              <div className='space-y-4'>
                <div className=''>
                  {numPages && numPages > 0 && (
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          size={'xs'}
                          onClick={onPrevPage}
                          disabled={pageNumber <= 1}
                          className='disabled:opacity-50'
                        >
                          <Icons.chevronLeft className='h-4 w-4' />
                        </Button>
                        <span className='text-primary'>
                          Page {pageNumber} of {numPages}
                        </span>
                        <Button
                          size={'xs'}
                          onClick={onNextPage}
                          disabled={pageNumber >= numPages}
                          className='disabled:opacity-50'
                        >
                          <Icons.chevronRight className='h-4 w-4' />
                        </Button>
                      </div>
                      {blob && (
                        <Button asChild>
                          <a
                            href={URL.createObjectURL(blob)}
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
                <div id='resume-pdf-preview'>
                  <Document
                    loading={<FallBackLoader />}
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    error={<div>Failed to load PDF</div>}
                    onLoadError={(error) => {
                      console.error('Error loading PDF:', error);
                    }}
                  >
                    <Page
                      key={`page-${pageNumber}`}
                      pageNumber={pageNumber}
                      loading={<FallBackLoader />}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
              </div>
            );
          }}
        </BlobProvider>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return !(
      prevProps.templateId !== nextProps.templateId ||
      JSON.stringify(prevProps.formData) !== JSON.stringify(nextProps.formData)
    );
  }
);

PdfRenderer.displayName = 'PdfRenderer';

export default PdfRenderer;
