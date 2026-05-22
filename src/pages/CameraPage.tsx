import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ImageIcon } from 'lucide-react';

export function CameraPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = () => {
    if (!image) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('OCR识别功能正在开发中，敬请期待！\n\n您可以使用文本导入功能手动输入菜谱内容。');
    }, 2000);
  };

  const handleRetry = () => {
    setImage(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">拍照识别菜谱</h1>

          {!image ? (
            <div className="space-y-6">
              <div className="relative aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500">点击下方按钮拍照或选择图片</p>
                <p className="text-sm text-gray-400 mt-2">支持 JPG、PNG 格式</p>
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <ImageIcon className="w-5 h-5" />
                  选择图片
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => document.getElementById('camera-input')?.click()}
                >
                  <Camera className="w-5 h-5" />
                  拍照
                </button>
              </div>

              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img src={image} alt="Preview" className="w-full h-full object-contain bg-gray-100" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                      <p>正在识别...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  重新选择
                </button>
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Camera className="w-5 h-5" />
                  {isProcessing ? '识别中...' : '开始识别'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">功能说明</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 支持拍照或从相册选择图片</li>
              <li>• 使用OCR技术识别图片中的文字</li>
              <li>• 自动解析菜谱结构（菜名、食材、做法）</li>
              <li>• 一键保存到菜谱库</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>注意：</strong>OCR识别功能正在开发中，目前仅提供界面预览。您可以使用文本导入功能手动输入菜谱内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}