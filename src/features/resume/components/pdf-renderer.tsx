'use client';

import { Icons } from '@/components/icons';
import { BlobProvider } from '@react-pdf/renderer';
import { memo, useState, useEffect } from 'react';
import { Document, Page, pdfjs, usePageContext } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { getTemplate } from '../templates/registry';
import { TResumeEditFormValues } from '../utils/form-schema';

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

    return (
      <div className='relative min-h-[500px]'>
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
                <div className=''>
                  {numPages && numPages > 0 && (
                    <div className='flex items-center justify-between px-4'>
                      <div>
                        <button
                          onClick={onPrevPage}
                          disabled={pageNumber <= 1}
                          className='bg-black disabled:opacity-50'
                        >
                          <Icons.chevronLeft className='h-4 w-4' />
                        </button>
                        <span className='mx-1 text-primary'>
                          Page {pageNumber} of {numPages}
                        </span>
                        <button
                          onClick={onNextPage}
                          disabled={pageNumber >= numPages}
                          className='bg-black disabled:opacity-50'
                        >
                          <Icons.chevronRight className='h-4 w-4' />
                        </button>
                      </div>
                      {blob && (
                        <a
                          href={URL.createObjectURL(blob)}
                          download='resume.pdf'
                          className='text-primary hover:underline'
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                  )}
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
