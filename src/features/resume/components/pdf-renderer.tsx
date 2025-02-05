'use client';

import { Icons } from '@/components/icons';
import { BlobProvider } from '@react-pdf/renderer';
import { memo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
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

const PdfRenderer = memo(({ formData, templateId }: TPdfRendererProps) => {
  const template = getTemplate(templateId);
  const Template = template.component;
  const [numPages, setNumPages] = useState<number>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [render, setRender] = useState(0);
  // const [instance, updateInstance] = usePDF({
  //   document: <ResumeTemplate formData={formData} />,
  // });
  const [pageNumber, setPageNumber] = useState<number>(1);
  console.log('comp rendered');

  // console.log("comp rerender?", instance);
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
      <p>
        <Icons.spinner className='animate-spin' />
      </p>
    );
  }

  // const MemoizedResumeTemplate = memo(ResumeTemplate);

  return (
    <div>
      <BlobProvider
        key={templateId}
        document={<Template formData={formData} />}
      >
        {({ blob, url, loading, error }) => {
          console.log('blob', blob, url, loading, error);
          if (loading) {
            return <FallBackLoader />;
          }

          return (
            <>
              <Document
                key={templateId}
                loading={<FallBackLoader />}
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <div className='my-2 flex cursor-pointer items-center text-black'>
                <Icons.chevronLeft onClick={onPrevPage} /> {pageNumber} of{' '}
                {numPages}
                <Icons.chevronRight onClick={onNextPage} />
                <a href={url!} download='resume.pdf'>
                  Download
                </a>
              </div>
            </>
          );
        }}
      </BlobProvider>
    </div>
  );
});
export default PdfRenderer;

PdfRenderer.displayName = 'PdfRenderer';
