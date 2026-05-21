import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Move, Scissors, X, Grid, Check, RotateCcw } from 'lucide-react';
import { uploadMedia } from '../../../lib/supabaseApi';
import { useToast } from './Toast';

export default function ImageCollectionUpload({ value = '', onChange, label }) {
  const { showToast } = useToast();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragover, setDragover] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  
  // Crop modal state
  const [cropFile, setCropFile] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  
  const fileInputRef = useRef(null);

  // Sync state with parent value CSV
  useEffect(() => {
    if (value) {
      const list = value.split(',').map(s => s.trim()).filter(Boolean);
      setImages(list);
    } else {
      setImages([]);
    }
  }, [value]);

  // Handle new files dropped or selected
  function handleFileSelect(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.', 'error');
      return;
    }
    
    // Read file for cropping preview
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropFile(file);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  }

  // Handle completed crop from modal
  async function handleCropCompleted(croppedBlob, originalName) {
    setShowCropModal(false);
    setUploading(true);
    try {
      const fileToUpload = new File([croppedBlob], originalName, { type: 'image/jpeg' });
      const publicUrl = await uploadMedia(fileToUpload);
      
      const newImages = [...images, publicUrl];
      onChange(newImages.join(','));
      showToast('Image cropped and uploaded successfully!', 'success');
    } catch (err) {
      console.error('Upload failed:', err);
      showToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setUploading(false);
      setCropFile(null);
      setCropImageSrc('');
    }
  }

  // Remove image
  function handleRemove(idx) {
    const newImages = images.filter((_, i) => i !== idx);
    onChange(newImages.join(','));
    showToast('Image removed from collection.', 'success');
  }

  // HTML5 Drag and Drop Sorting for Reordering
  function handleDragStart(e, idx) {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx);
  }

  function handleDragOver(e, idx) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
  }

  function handleDrop(e, targetIdx) {
    e.preventDefault();
    const sourceIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(sourceIdx) || sourceIdx === targetIdx) {
      setDraggedIdx(null);
      return;
    }

    const reordered = [...images];
    const [removed] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, removed);
    
    onChange(reordered.join(','));
    setDraggedIdx(null);
    showToast('Reordered collection.', 'success');
  }

  // Upload dropzone event listeners
  function onDropZoneDrop(e) {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  return (
    <div className="admin-field" style={{ marginBottom: '24px' }}>
      {label && <label className="admin-label">{label}</label>}

      {/* Dynamic Gallery of Images with Reordering */}
      {images.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Move size={12} /> Drag and drop thumbnails to reorder, click × to delete.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '12px'
          }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                style={{
                  position: 'relative',
                  aspectRatio: '220/150',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: draggedIdx === idx ? '2px dashed #ffffff' : '1px solid rgba(255,255,255,0.1)',
                  opacity: draggedIdx === idx ? 0.4 : 1,
                  cursor: 'grab',
                  background: '#0a0a0a',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                className="group"
              >
                <img
                  src={img}
                  alt={`Gallery item ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Drag Indicator Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  pointerEvents: 'none'
                }} className="gallery-drag-overlay">
                  <Move size={16} color="#fff" />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '11px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    zIndex: 10
                  }}
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Drop Zone */}
      <div
        className={`admin-upload-zone ${dragover ? 'dragover' : ''}`}
        onDrop={onDropZoneDrop}
        onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed rgba(255,255,255,0.15)',
          background: dragover ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          padding: '24px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minHeight: '110px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {uploading ? (
          <>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <p className="upload-text" style={{ color: '#a1a1aa', fontSize: '13px', margin: 0 }}>Uploading dynamic cropped image...</p>
          </>
        ) : (
          <>
            <ImageIcon size={28} className="upload-icon" style={{ color: '#71717a', marginBottom: '8px' }} />
            <p className="upload-text" style={{ color: '#a1a1aa', fontSize: '13px', margin: 0 }}>
              <strong>Drag & drop a new service image</strong> or click to browse<br />
              <span style={{ fontSize: '11px', color: '#52525b' }}>Images will open in the visual cropper automatically</span>
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = ''; // Reset input to allow selecting same file again
        }}
        style={{ display: 'none' }}
      />

      {/* Crop Modal Overlay */}
      {showCropModal && (
        <ImageCropperModal
          src={cropImageSrc}
          filename={cropFile?.name || 'cropped_image.jpg'}
          filetype={cropFile?.type || 'image/jpeg'}
          defaultAspect="22/15"
          onCancel={() => {
            setShowCropModal(false);
            setCropFile(null);
            setCropImageSrc('');
          }}
          onSave={handleCropCompleted}
        />
      )}
      
      {/* Dynamic drag styles inject */}
      <style>{`
        .group:hover .gallery-drag-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

// Safe ratio parser to avoid dynamic eval/Rolldown minification warning
function parseRatio(ratioStr) {
  if (!ratioStr || ratioStr === 'free') return 1;
  const parts = ratioStr.split('/');
  if (parts.length === 2) {
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den;
    }
  }
  const val = parseFloat(ratioStr);
  return isNaN(val) ? 1 : val;
}

// Visual Image Cropper Modal with Aspect Ratio presets and Rule-of-Thirds Grid lines
export function ImageCropperModal({ src, filename, filetype, defaultAspect = '22/15', onCancel, onSave }) {
  const [aspectRatio, setAspectRatio] = useState(defaultAspect); // default aspect ratio
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });
  const [interactionActive, setInteractionActive] = useState(null); // 'move' or 'resize'
  const [cropping, setCropping] = useState(false);
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  // Crop rectangle state (pixels relative to rendered image)
  const [cropState, setCropState] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const cropRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dragStateRef = useRef(null);

  // Re-initialize crop rectangle when aspect ratio or rendered size changes
  useEffect(() => {
    if (renderedSize.width === 0 || renderedSize.height === 0) return;
    
    const w = renderedSize.width;
    const h = renderedSize.height;
    
    let cropWidth, cropHeight;
    
    if (aspectRatio === 'free') {
      cropWidth = w * 0.8;
      cropHeight = h * 0.8;
    } else {
      const ratio = parseRatio(aspectRatio); // width / height
      if (w / h > ratio) {
        // Image is wider than crop aspect ratio
        cropHeight = h * 0.8;
        cropWidth = cropHeight * ratio;
      } else {
        // Image is taller than crop aspect ratio
        cropWidth = w * 0.8;
        cropHeight = cropWidth / ratio;
      }
    }
    
    const cropX = (w - cropWidth) / 2;
    const cropY = (h - cropHeight) / 2;
    
    const newCrop = { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
    cropRef.current = newCrop;
    setCropState(newCrop);
  }, [aspectRatio, renderedSize]);

  // Capture rendered size when image loads
  function handleImageLoad(e) {
    const imgEl = e.target;
    // Set container constraints
    const container = containerRef.current;
    if (container) {
      const rect = imgEl.getBoundingClientRect();
      setRenderedSize({ width: rect.width, height: rect.height });
    }
  }

  // Handle window resizing or initial loading lag
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setRenderedSize({ width: rect.width, height: rect.height });
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag and Resize Handlers
  const startDrag = (e, mode, handle = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    dragStateRef.current = {
      mode,
      handle,
      startX: clientX,
      startY: clientY,
      startCrop: { ...cropRef.current }
    };
    
    setInteractionActive(mode);
  };

  useEffect(() => {
    if (!interactionActive) return;
    
    const handleMove = (e) => {
      const state = dragStateRef.current;
      if (!state) return;
      
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      const dx = clientX - state.startX;
      const dy = clientY - state.startY;
      
      let { x, y, width, height } = state.startCrop;
      const imgW = renderedSize.width;
      const imgH = renderedSize.height;
      const minSize = 30; // Minimum size for the crop box
      
      if (state.mode === 'move') {
        x += dx;
        y += dy;
        // Clamp to boundary
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + width > imgW) x = imgW - width;
        if (y + height > imgH) y = imgH - height;
      } else if (state.mode === 'resize') {
        const handle = state.handle;
        
        if (aspectRatio === 'free') {
          if (handle === 'tl') {
            const newX = Math.max(0, Math.min(x + width - minSize, x + dx));
            width = width + (x - newX);
            x = newX;
            const newY = Math.max(0, Math.min(y + height - minSize, y + dy));
            height = height + (y - newY);
            y = newY;
          } else if (handle === 'tr') {
            width = Math.max(minSize, Math.min(imgW - x, width + dx));
            const newY = Math.max(0, Math.min(y + height - minSize, y + dy));
            height = height + (y - newY);
            y = newY;
          } else if (handle === 'bl') {
            const newX = Math.max(0, Math.min(x + width - minSize, x + dx));
            width = width + (x - newX);
            x = newX;
            height = Math.max(minSize, Math.min(imgH - y, height + dy));
          } else if (handle === 'br') {
            width = Math.max(minSize, Math.min(imgW - x, width + dx));
            height = Math.max(minSize, Math.min(imgH - y, height + dy));
          }
        } else {
          // Locked Aspect Ratio scaling
          const ratio = parseRatio(aspectRatio);
          
          if (handle === 'br') {
            width = Math.max(minSize, Math.min(imgW - x, width + dx));
            height = width / ratio;
            if (y + height > imgH) {
              height = imgH - y;
              width = height * ratio;
            }
          } else if (handle === 'bl') {
            const newX = Math.max(0, Math.min(x + width - minSize, x + dx));
            const newWidth = width + (x - newX);
            const newHeight = newWidth / ratio;
            if (y + newHeight <= imgH) {
              width = newWidth;
              x = newX;
              height = newHeight;
            }
          } else if (handle === 'tr') {
            width = Math.max(minSize, Math.min(imgW - x, width + dx));
            const newHeight = width / ratio;
            const newY = y + height - newHeight;
            if (newY >= 0) {
              height = newHeight;
              y = newY;
            } else {
              height = y + height;
              width = height * ratio;
              y = 0;
            }
          } else if (handle === 'tl') {
            const newX = Math.max(0, Math.min(x + width - minSize, x + dx));
            const newWidth = width + (x - newX);
            const newHeight = newWidth / ratio;
            const newY = y + height - newHeight;
            if (newY >= 0) {
              width = newWidth;
              x = newX;
              height = newHeight;
              y = newY;
            }
          }
        }
      }
      
      const newCrop = { x, y, width, height };
      cropRef.current = newCrop;
      setCropState(newCrop);
    };
    
    const handleUp = () => {
      setInteractionActive(null);
      dragStateRef.current = null;
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [interactionActive, renderedSize, aspectRatio]);

  // Perform canvas cropping and convert back to Blob
  function handlePerformCrop() {
    if (!imageRef.current) return;
    setCropping(true);
    
    const imgEl = imageRef.current;
    const crop = cropRef.current;
    
    // Calculate sizing factors from original image file size to current rendered display size
    const scaleX = imgEl.naturalWidth / renderedSize.width;
    const scaleY = imgEl.naturalHeight / renderedSize.height;
    
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropW = crop.width * scaleX;
    const cropH = crop.height * scaleY;
    
    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setCropping(false);
      return;
    }
    
    // Enable high-quality smoothing algorithms
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw the image slice onto the canvas
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Prevent CORS tainted canvas
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onSave(blob, filename);
          } else {
            setCropping(false);
            alert('Failed to crop image. Please try again.');
          }
        },
        filetype,
        0.95 // High quality JPEG/PNG output
      );
    };
    img.onerror = (e) => {
      console.error('Failed to load crop image:', e);
      setCropping(false);
      alert('Failed to load image in high resolution for cropping.');
    };
  }

  // Predefined Aspect Ratio options
  const AR_PRESETS = [
    { id: '22/15', label: 'Marquee Card (22:15)' },
    { id: '1/1', label: '1:1 Square' },
    { id: '4/3', label: '4:3 Classic' },
    { id: '16/9', label: '16:9 Cinema' },
    { id: 'free', label: 'Freeform' },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 5, 5, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px',
      color: '#fff',
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Modal Card */}
      <div style={{
        background: '#09090b',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        width: '100%',
        maxW: '800px',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scissors size={18} color="#a1a1aa" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Visual Image Cropper</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Aspect Ratio Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.01)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          overflowX: 'auto'
        }}>
          {AR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setAspectRatio(preset.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: aspectRatio === preset.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: aspectRatio === preset.id ? '#ffffff' : '#71717a',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Cropping Main Area */}
        <div style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#040404',
          minHeight: '320px',
          maxHeight: '480px',
          overflow: 'hidden',
          position: 'relative'
        }} ref={containerRef}>
          {/* Image Wrapper */}
          <div style={{
            position: 'relative',
            maxHeight: '430px',
            maxWidth: '100%',
            display: 'inline-block'
          }}>
            <img
              ref={imageRef}
              src={src}
              alt="Crop target"
              onLoad={handleImageLoad}
              style={{
                display: 'block',
                maxHeight: '430px',
                maxWidth: '100%',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'none'
              }}
            />

            {/* Backdrop Mask layer covering cropped out region */}
            {renderedSize.width > 0 && (
              <>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.65)',
                  pointerEvents: 'none'
                }}></div>

                {/* Highlight Cutout (the highlighted cropped box) */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${cropState.x}px`,
                    top: `${cropState.y}px`,
                    width: `${cropState.width}px`,
                    height: `${cropState.height}px`,
                    backgroundImage: `url(${src})`,
                    backgroundPosition: `-${cropState.x}px -${cropState.y}px`,
                    backgroundSize: `${renderedSize.width}px ${renderedSize.height}px`,
                    backgroundRepeat: 'no-repeat',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.2)', // Visual isolation
                    cursor: 'move',
                    touchAction: 'none'
                  }}
                  onMouseDown={(e) => startDrag(e, 'move')}
                  onTouchStart={(e) => startDrag(e, 'move')}
                >
                  {/* Subtle Grid Lines Overlay (Image 2 Style) */}
                  <div className="crop-grid-line-h1"></div>
                  <div className="crop-grid-line-h2"></div>
                  <div className="crop-grid-line-v1"></div>
                  <div className="crop-grid-line-v2"></div>

                  {/* Corner Thick Brackets Overlay */}
                  <div className="crop-handle-tl" onMouseDown={(e) => startDrag(e, 'resize', 'tl')} onTouchStart={(e) => startDrag(e, 'resize', 'tl')}></div>
                  <div className="crop-handle-tr" onMouseDown={(e) => startDrag(e, 'resize', 'tr')} onTouchStart={(e) => startDrag(e, 'resize', 'tr')}></div>
                  <div className="crop-handle-bl" onMouseDown={(e) => startDrag(e, 'resize', 'bl')} onTouchStart={(e) => startDrag(e, 'resize', 'bl')}></div>
                  <div className="crop-handle-br" onMouseDown={(e) => startDrag(e, 'resize', 'br')} onTouchStart={(e) => startDrag(e, 'resize', 'br')}></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: '#09090b'
        }}>
          <p style={{ fontSize: '11px', color: '#71717a', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Grid size={12} /> Drag corners to crop. Box is locked to the aspect ratio.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={onCancel}
              disabled={cropping}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handlePerformCrop}
              disabled={cropping || renderedSize.width === 0}
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                color: '#000000'
              }}
            >
              {cropping ? (
                <>
                  <div className="admin-spinner" style={{ borderLeftColor: '#000000' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  Crop & Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Styled Grid, Corner Brackets, and Modal Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* 3x3 Grid Overlay Lines */
        .crop-grid-line-h1 {
          position: absolute;
          top: 33.33%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.35);
          pointer-events: none;
          box-shadow: 0 0 1px rgba(0,0,0,0.5);
        }
        .crop-grid-line-h2 {
          position: absolute;
          top: 66.66%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.35);
          pointer-events: none;
          box-shadow: 0 0 1px rgba(0,0,0,0.5);
        }
        .crop-grid-line-v1 {
          position: absolute;
          left: 33.33%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(255, 255, 255, 0.35);
          pointer-events: none;
          box-shadow: 0 0 1px rgba(0,0,0,0.5);
        }
        .crop-grid-line-v2 {
          position: absolute;
          left: 66.66%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(255, 255, 255, 0.35);
          pointer-events: none;
          box-shadow: 0 0 1px rgba(0,0,0,0.5);
        }
        
        /* Thick Corner Brackets (matching Image 2) */
        .crop-handle-tl {
          position: absolute;
          top: -4px;
          left: -4px;
          width: 16px;
          height: 16px;
          border-top: 4px solid #ffffff;
          border-left: 4px solid #ffffff;
          cursor: nwse-resize;
          z-index: 10;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
        }
        .crop-handle-tr {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          border-top: 4px solid #ffffff;
          border-right: 4px solid #ffffff;
          cursor: nesw-resize;
          z-index: 10;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
        }
        .crop-handle-bl {
          position: absolute;
          bottom: -4px;
          left: -4px;
          width: 16px;
          height: 16px;
          border-bottom: 4px solid #ffffff;
          border-left: 4px solid #ffffff;
          cursor: nesw-resize;
          z-index: 10;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
        }
        .crop-handle-br {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          border-bottom: 4px solid #ffffff;
          border-right: 4px solid #ffffff;
          cursor: nwse-resize;
          z-index: 10;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
        }
      `}</style>
    </div>
  );
}
