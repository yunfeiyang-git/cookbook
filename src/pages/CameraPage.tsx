import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ImageIcon, CheckCircle, Edit } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface ParsedRecipe {
  name: string;
  ingredients: string[];
  steps: string[];
  notes: string;
}

export function CameraPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setRecognizedText('');
        setParsedRecipe(null);
        setShowPreview(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseRecipeText = (text: string): ParsedRecipe => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let name = '';
    let ingredients: string[] = [];
    let steps: string[] = [];
    let notes = '';
    
    let currentSection = 'name';
    let nameFound = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (!nameFound && line.length > 0 && line.length < 30) {
        name = line;
        nameFound = true;
        currentSection = 'ingredients';
        continue;
      }
      
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('食材') || lowerLine.includes('材料') || lowerLine.includes('主料') || lowerLine.includes('配料')) {
        currentSection = 'ingredients';
        continue;
      }
      if (lowerLine.includes('做法') || lowerLine.includes('步骤') || lowerLine.includes('制作') || lowerLine.match(/^\d+\./)) {
        currentSection = 'steps';
      }
      if (lowerLine.includes('提示') || lowerLine.includes('注意') || lowerLine.includes('备注')) {
        currentSection = 'notes';
      }
      
      switch (currentSection) {
        case 'name':
          if (!nameFound) {
            name = line;
            nameFound = true;
          }
          break;
        case 'ingredients':
          ingredients.push(line);
          break;
        case 'steps':
          steps.push(line);
          break;
        case 'notes':
          notes += line + ' ';
          break;
      }
    }
    
    if (!name && lines.length > 0) {
      name = lines[0];
      ingredients = lines.slice(1, 10);
      steps = lines.slice(10);
    }
    
    return {
      name: name || '未命名菜谱',
      ingredients,
      steps,
      notes: notes.trim()
    };
  };

  const handleProcess = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    setProgress(0);
    setStatus('加载OCR引擎...');
    setShowPreview(false);
    
    try {
      const result = await Tesseract.recognize(
        image,
        'chi_sim+eng',
        {
          logger: (m: any) => {
            if (m.status === 'loading tesseract core') {
              setProgress(10);
              setStatus('加载OCR核心...');
            } else if (m.status === 'initializing tesseract') {
              setProgress(30);
              setStatus('初始化OCR引擎...');
            } else if (m.status === 'loading language traineddata') {
              setProgress(50);
              setStatus('加载语言包...');
            } else if (m.status === 'initializing api') {
              setProgress(70);
              setStatus('初始化API...');
            } else if (m.status === 'recognizing text') {
              setProgress(Math.min(70 + m.progress * 30, 95));
              setStatus('识别文字...');
            }
          }
        }
      );
      
      setProgress(95);
      setStatus('解析菜谱...');
      
      const text = result.data.text;
      setRecognizedText(text);
      
      const parsed = parseRecipeText(text);
      setParsedRecipe(parsed);
      
      setProgress(100);
      setStatus('识别完成！');
      setShowPreview(true);
      
    } catch (error) {
      console.error('OCR识别失败:', error);
      alert('OCR识别失败，请检查网络连接或重试。\n\n您也可以使用文本导入功能手动输入菜谱内容。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setImage(null);
    setRecognizedText('');
    setParsedRecipe(null);
    setShowPreview(false);
    setProgress(0);
    setStatus('');
  };

  const handleUseRecipe = () => {
    if (!parsedRecipe) return;
    
    const recipeData = {
      name: parsedRecipe.name,
      ingredients: parsedRecipe.ingredients.join('\n'),
      steps: parsedRecipe.steps.join('\n'),
      notes: parsedRecipe.notes,
      category: '未分类',
      image: image || ''
    };
    
    navigate('/create', { state: { fromOcr: true, recipeData } });
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

          {!showPreview ? (
            <div className="space-y-6">
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
                        <div className="text-center text-white max-w-xs">
                          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                          <p className="mb-2">{status}</p>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-white h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-sm text-white/70 mt-1">{Math.round(progress)}%</p>
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
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-6 h-6" />
                <span className="font-medium">识别成功！</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">识别结果预览</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">菜名</label>
                    <p className="text-gray-900">{parsedRecipe?.name}</p>
                  </div>
                  
                  {parsedRecipe && parsedRecipe.ingredients.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">食材</label>
                      <ul className="text-gray-600 text-sm space-y-1">
                        {parsedRecipe.ingredients.slice(0, 8).map((ing, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{ing}</span>
                          </li>
                        ))}
                        {parsedRecipe.ingredients.length > 8 && (
                          <li className="text-gray-400">...还有 {parsedRecipe.ingredients.length - 8} 项</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {parsedRecipe && parsedRecipe.steps.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">做法</label>
                      <ul className="text-gray-600 text-sm space-y-1">
                        {parsedRecipe.steps.slice(0, 5).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-gray-400">{idx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                        {parsedRecipe.steps.length > 5 && (
                          <li className="text-gray-400">...还有 {parsedRecipe.steps.length - 5} 步</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-800 mb-3">原始识别文字</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{recognizedText}</pre>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  重新识别
                </button>
                <button
                  onClick={handleUseRecipe}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  编辑并保存
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
              <li>• 支持中文和英文识别</li>
              <li>• 识别后可编辑并保存到菜谱库</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>提示：</strong>首次使用需要下载OCR语言包，可能需要几分钟时间。建议使用清晰、光线充足的图片以获得更好的识别效果。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}