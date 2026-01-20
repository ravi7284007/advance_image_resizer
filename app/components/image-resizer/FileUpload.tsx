'use client';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFilesSelected, disabled }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
  };

  const handleClick = () => {
    document.getElementById('upload')?.click();
  };

  return (
    <div 
      className={`border-2 border-dashed border-blue-500 rounded-xl p-8 mb-6 bg-blue-50 cursor-pointer transition-all duration-300 hover:border-purple-500 hover:bg-blue-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : handleClick}
    >
      <label className="block cursor-pointer text-blue-600 font-semibold text-center">
        📁 Click to select images or drag & drop
      </label>
      <input 
        type="file" 
        id="upload" 
        accept="image/*" 
        multiple 
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
}