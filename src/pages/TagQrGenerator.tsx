import React, { useMemo, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

// 1. Props interfeysini təyin edirik
interface TagQrGeneratorProps {
  uniqueCode: string;
}

const TagQrGenerator: React.FC<TagQrGeneratorProps> = ({ uniqueCode }) => {
  // 2. Ref-in HTMLDivElement olduğunu bildiririk
  const qrRef = useRef<HTMLDivElement>(null);

  const qrValue = `https://tagim.az/scan/${uniqueCode}`;

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
      <g><rect fill="none" height="24" width="24" y="0"/></g>
      <g><path fill="%23000000" d="M18.92,6.01C18.72,5.42,18.16,5,17.5,5h-11C5.84,5,5.29,5.42,5.08,6.01L3,12v8c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1 h12v1c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-8L18.92,6.01z M7.5,16C6.67,16,6,15.33,6,14.5S6.67,13,7.5,13S9,13.67,9,14.5 S8.33,16,7.5,16z M16.5,16c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S17.33,16,16.5,16z M5.81,10l1.04-3h10.29 l1.04,3H5.81z"/></g>
    </svg>
  `;

  const iconSrc = useMemo(() => {
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  }, []);

  const downloadQRCode = () => {
    // TypeScript tələb edir ki, elementin mövcudluğunu yoxlayaq
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `tagim_qr_${uniqueCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div style={styles.container}>
      <h3>QR Kod Generator</h3>
      <p>Unikal Kod: <strong>{uniqueCode}</strong></p>

      {/* QR Kod Wrapper */}
      <div ref={qrRef} style={styles.qrWrapper}>
        <QRCodeCanvas 
          value={qrValue} 
          size={256}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}
          includeMargin={true}
          imageSettings={{
            src: iconSrc, 
            x: undefined,
            y: undefined,
            height: 50,
            width: 50,
            excavate: true,
          }}
        />
      </div>

      <button onClick={downloadQRCode} style={styles.button}>
        QR Kodu Yüklə (PNG)
      </button>
    </div>
  );
};

// 3. Styllər üçün Type təyini (React.CSSProperties)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: '0 auto'
  },
  qrWrapper: {
    padding: '10px',
    border: '2px dashed #333',
    borderRadius: '8px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default TagQrGenerator;