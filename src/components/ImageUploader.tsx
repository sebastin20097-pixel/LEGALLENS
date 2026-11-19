import { useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  ImageIcon,
  X,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  FileImage,
} from 'lucide-react';

interface Props {
  file: File | null;
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
  onClear: () => void;
  onReject: (message: string) => void;
}

const MAX_SIZE_MB = 10;

export default function ImageUploader({
  file,
  previewUrl,
  onFileSelected,
  onClear,
  onReject,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/')
      );
      const pasted = item?.getAsFile();
      if (pasted) onFileSelected(pasted);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [onFileSelected]);

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      onReject('Please upload an image file (PNG, JPG, or WebP).');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      onReject(`That image is larger than ${MAX_SIZE_MB} MB. Please upload a smaller file.`);
      return;
    }
    setZoomed(false);
    onFileSelected(f);
  };

  if (file && previewUrl) {
    return (
      <div className="card-premium overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-7">
          <div
            className={`group relative shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-card ${
              zoomed ? 'sm:w-full' : 'sm:w-52'
            }`}
          >
            <img
              src={previewUrl}
              alt={`Preview of ${file.name}`}
              className={`w-full bg-slate-50 object-contain transition-all duration-300 ${
                zoomed ? 'max-h-[32rem]' : 'h-52'
              }`}
            />
            <button
              onClick={() => setZoomed(!zoomed)}
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 backdrop-blur transition-opacity hover:bg-slate-900 group-hover:opacity-100"
              aria-label={zoomed ? 'Shrink preview' : 'Enlarge preview'}
            >
              {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 self-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200 sm:self-start">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Image ready
            </span>
            <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
              <FileImage className="h-4 w-4 shrink-0 text-blue-600" />
              <p className="break-all font-display text-lg font-semibold text-slate-900">
                {file.name}
              </p>
            </div>
            <div className="mt-1 flex items-center justify-center gap-3 text-sm text-slate-500 sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                {file.type.replace('image/', '').toUpperCase() || 'IMAGE'}
              </span>
              <span>·</span>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
              <button
                onClick={() => inputRef.current?.click()}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Replace Image
              </button>
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed px-6 py-16 text-center backdrop-blur transition-all duration-300 sm:py-20 ${
        dragOver
          ? 'scale-[1.01] border-blue-500 bg-blue-50 shadow-glow'
          : 'border-slate-300 bg-white/70 hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-card'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <span className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
          <UploadCloud className="h-9 w-9" />
        </span>
      </span>
      <span className="mt-6 font-display text-xl font-bold text-slate-900">
        Drag &amp; drop your product image here
      </span>
      <span className="mt-1.5 text-sm text-slate-500">
        or click to browse · PNG, JPG, WebP up to {MAX_SIZE_MB} MB
      </span>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
        You can also paste an image from your clipboard
      </span>
      <span className="mt-7 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition group-hover:bg-blue-600">
        Select Image
      </span>
    </label>
  );
}
