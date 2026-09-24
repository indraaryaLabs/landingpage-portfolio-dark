import { useState, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { uploadMedia } from '../../../lib/supabaseApi';
import { ImageCropperModal } from './ImageCollectionUpload';

export default function ImageUpload({ value, onChange, label, aspect = 'free', optimized = false, canRemove = true, onUploadingChange = () => {} }) {
  const [uploading, setUploading] = useState(false);
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef(null);

  // Crop modal state
  const [cropFile, setCropFile] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);

  function handleFileSelect(file) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please select a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Please select a file smaller than 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropFile(file);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  }

  async function handleCropCompleted(croppedBlob, originalName) {
    setShowCropModal(false);
    setUploading(true);
    onUploadingChange(true);
    try {
      const type = croppedBlob.type || 'image/jpeg';
      const extension = type === 'image/webp' ? 'webp' : type === 'image/png' ? 'png' : 'jpg';
      const fileToUpload = new File([croppedBlob], `${originalName.replace(/\.[^.]+$/, '')}.${extension}`, { type });
      const publicUrl = await uploadMedia(fileToUpload);
      onChange(publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      onUploadingChange(false);
      setCropFile(null);
      setCropImageSrc('');
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragover(true);
  }

  function onDragLeave() {
    setDragover(false);
  }

  function onFileSelect(e) {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
    e.target.value = ''; // reset to allow selecting same file again
  }

  return (
    <div className="admin-field">
      {label && <label className="admin-label">{label}</label>}
      {value ? (
        <div className="admin-upload-preview">
          <img src={value} alt="Preview" />
          <div className="preview-overlay">
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={14} /> Replace
            </button>
            {canRemove && <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => onChange('')}
              disabled={uploading}
            >
              <Trash2 size={14} /> Restore template
            </button>}
          </div>
        </div>
      ) : (
        <div
          className={`admin-upload-zone ${dragover ? 'dragover' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label || 'image'}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inputRef.current?.click(); } }}
        >
          {uploading ? (
            <>
              <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
              <p className="upload-text">Uploading cropped image...</p>
            </>
          ) : (
            <>
              <ImageIcon size={32} className="upload-icon" />
              <p className="upload-text">
                <strong>Click to upload</strong> or drag and drop<br />
                <span style={{ fontSize: 11, color: '#52525b' }}>Images will open in the cropper automatically</span>
              </p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileSelect}
        style={{ display: 'none' }}
      />

      {/* Reusable Visual Cropper Modal overlay */}
      {showCropModal && (
        <ImageCropperModal
          src={cropImageSrc}
          filename={cropFile?.name || 'cropped_image.jpg'}
          filetype={cropFile?.type || 'image/jpeg'}
          defaultAspect={aspect}
          outputType={optimized ? 'image/webp' : cropFile?.type || 'image/jpeg'}
          maxWidth={optimized ? 1440 : undefined}
          onCancel={() => {
            setShowCropModal(false);
            setCropFile(null);
            setCropImageSrc('');
          }}
          onSave={handleCropCompleted}
        />
      )}
    </div>
  );
}
