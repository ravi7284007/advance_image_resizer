'use client';

import { ImageResizerSettings } from '../../types';

interface ControlPanelProps {
  settings: ImageResizerSettings;
  onSettingsChange: (settings: Partial<ImageResizerSettings>) => void;
  onReset: () => void;
}

export default function ControlPanel({ settings, onSettingsChange, onReset }: ControlPanelProps) {
  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onSettingsChange({ backgroundImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      {/* Output Dimensions */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Output Width (px)</label>
        <input
          type="number"
          min="100"
          max="5000"
          value={settings.outputWidth || 832}
          onChange={(e) => onSettingsChange({ outputWidth: parseInt(e.target.value) || 832 })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Output Height (px)</label>
        <input
          type="number"
          min="100"
          max="5000"
          value={settings.outputHeight || 832}
          onChange={(e) => onSettingsChange({ outputHeight: parseInt(e.target.value) || 832 })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Background Removal */}
      <div className="space-y-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.removeBackground}
            onChange={(e) => onSettingsChange({ removeBackground: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-semibold text-gray-700">Remove Background</span>
        </label>
        
        {settings.removeBackground && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mt-2">
            <label className="block text-xs font-medium text-gray-600 mb-2">Background Type</label>
            <select
              value={settings.bgType}
              onChange={(e) => onSettingsChange({ bgType: e.target.value as any })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md mb-2"
            >
              <option value="transparent">Transparent</option>
              <option value="color">Solid Color</option>
              <option value="image">Image</option>
            </select>
            
            {settings.bgType === 'color' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            )}
            
            {settings.bgType === 'image' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Background Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="w-full p-1 text-xs border border-gray-300 rounded-md"
                />
                {settings.backgroundImage && (
                  <div className="mt-2">
                    <img 
                      src={settings.backgroundImage} 
                      alt="Background preview" 
                      className="w-full h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => onSettingsChange({ backgroundImage: null })}
                      className="mt-1 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove background image
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Image will be stretched to fit canvas</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Effects */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Blur Intensity <span className="text-blue-600 font-semibold">{settings.blurIntensity}px</span>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={settings.blurIntensity}
          onChange={(e) => onSettingsChange({ blurIntensity: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Fade Effect <span className="text-blue-600 font-semibold">{settings.fadeEffect}px</span>
        </label>
        <input
          type="range"
          min="0"
          max="150"
          value={settings.fadeEffect}
          onChange={(e) => onSettingsChange({ fadeEffect: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Overlay Opacity <span className="text-blue-600 font-semibold">{settings.overlayOpacity}</span>
        </label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={settings.overlayOpacity}
          onChange={(e) => onSettingsChange({ overlayOpacity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Overlay Color</label>
        <input
          type="color"
          value={settings.overlayColor}
          onChange={(e) => onSettingsChange({ overlayColor: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>

      {/* Output Settings */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Output Format</label>
        <select
          value={settings.outputFormat}
          onChange={(e) => onSettingsChange({ outputFormat: e.target.value as any })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Quality (JPEG/WebP) <span className="text-blue-600 font-semibold">{settings.quality}%</span>
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={settings.quality}
          onChange={(e) => onSettingsChange({ quality: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Watermark Settings */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Watermark Text</label>
        <input
          type="text"
          placeholder="Optional watermark"
          value={settings.watermarkText}
          onChange={(e) => onSettingsChange({ watermarkText: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Watermark Position</label>
        <select
          value={settings.watermarkPosition}
          onChange={(e) => onSettingsChange({ watermarkPosition: e.target.value as any })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="bottom-center">Bottom Center</option>
          <option value="bottom-right">Bottom Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="top-center">Top Center</option>
          <option value="top-right">Top Right</option>
          <option value="top-left">Top Left</option>
          <option value="center">Center</option>
          <option value="repeat">Repeat All Over</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Watermark Size <span className="text-blue-600 font-semibold">{settings.watermarkSize}px</span>
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={settings.watermarkSize}
          onChange={(e) => onSettingsChange({ watermarkSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {settings.watermarkPosition === 'repeat' && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Watermark Spacing <span className="text-blue-600 font-semibold">{settings.repeatSpacing}px</span>
          </label>
          <input
            type="range"
            min="50"
            max="300"
            value={settings.repeatSpacing}
            onChange={(e) => onSettingsChange({ repeatSpacing: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Watermark Opacity <span className="text-blue-600 font-semibold">{settings.watermarkOpacity}</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={settings.watermarkOpacity}
          onChange={(e) => onSettingsChange({ watermarkOpacity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Watermark Color</label>
        <input
          type="color"
          value={settings.watermarkColor}
          onChange={(e) => onSettingsChange({ watermarkColor: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Watermark Font</label>
        <select
          value={settings.watermarkFont}
          onChange={(e) => onSettingsChange({ watermarkFont: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Impact">Impact</option>
        </select>
      </div>

      {/* Additional Controls */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Border Width <span className="text-blue-600 font-semibold">{settings.borderWidth}px</span>
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={settings.borderWidth}
          onChange={(e) => onSettingsChange({ borderWidth: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Border Color</label>
        <input
          type="color"
          value={settings.borderColor}
          onChange={(e) => onSettingsChange({ borderColor: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Brightness <span className="text-blue-600 font-semibold">{settings.brightness}%</span>
        </label>
        <input
          type="range"
          min="50"
          max="150"
          value={settings.brightness}
          onChange={(e) => onSettingsChange({ brightness: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Contrast <span className="text-blue-600 font-semibold">{settings.contrast}%</span>
        </label>
        <input
          type="range"
          min="50"
          max="150"
          value={settings.contrast}
          onChange={(e) => onSettingsChange({ contrast: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Saturation <span className="text-blue-600 font-semibold">{settings.saturation}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={settings.saturation}
          onChange={(e) => onSettingsChange({ saturation: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Reset Button */}
      <div className="md:col-span-2 lg:col-span-3 flex justify-center mt-4">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset Settings
        </button>
      </div>
    </div>
  );
}