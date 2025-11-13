import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// ✅ Use local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const PdfViewer = ({ dataUrl, fileName }) => {
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        console.log('📄 Loading PDF from:', dataUrl.substring(0, 100));
        
        const loadingTask = pdfjsLib.getDocument(dataUrl);
        const pdf = await loadingTask.promise;
        
        console.log('✅ PDF loaded, pages:', pdf.numPages);
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        await renderPage(pdf, 1);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading PDF:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadPdf();
  }, [dataUrl]);

  const renderPage = async (pdf, pageNum) => {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      console.log('✅ Rendered page', pageNum);
    } catch (err) {
      console.error('❌ Error rendering page:', err);
    }
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= numPages && pdfDoc) {
      setCurrentPage(pageNum);
      renderPage(pdfDoc, pageNum);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading PDF...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>Error loading PDF: {error}</p>
        <a href={dataUrl} download={fileName}>Download PDF instead</a>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <button 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage <= 1}
          style={{ marginRight: '10px', padding: '5px 15px' }}
        >
          ← Previous
        </button>
        <span style={{ margin: '0 20px', fontWeight: 'bold' }}>
          Page {currentPage} of {numPages}
        </span>
        <button 
          onClick={() => goToPage(currentPage + 1)} 
          disabled={currentPage >= numPages}
          style={{ marginLeft: '10px', padding: '5px 15px' }}
        >
          Next →
        </button>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        overflow: 'auto', 
        maxHeight: '600px',
        backgroundColor: '#fafafa',
        padding: '10px'
      }}>
        <canvas ref={canvasRef} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <a 
          href={dataUrl} 
          download={fileName}
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          📥 Download PDF
        </a>
      </div>
    </div>
  );
};