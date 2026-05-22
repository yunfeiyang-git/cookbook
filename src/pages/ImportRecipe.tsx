import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeStore } from '@/store/recipeStore';
import { ArrowLeft, FileText, Globe, Check } from 'lucide-react';

export function ImportRecipe() {
  const navigate = useNavigate();
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [textContent, setTextContent] = useState('');
  const [url, setUrl] = useState('');
  const [parsedRecipe, setParsedRecipe] = useState<{
    name: string;
    ingredients: string[];
    steps: string[];
    notes: string;
  } | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const parseTextRecipe = () => {
    const lines = textContent.split('\n').filter((line) => line.trim());
    if (lines.length === 0) {
      alert('请输入菜谱内容');
      return;
    }

    const result: {
      name: string;
      ingredients: string[];
      steps: string[];
      notes: string;
    } = {
      name: lines[0].replace(/^[\d.。、\s]*|\*$/g, '').trim(),
      ingredients: [],
      steps: [],
      notes: '',
    };

    let inIngredients = false;
    let inSteps = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('食材') || line.includes('材料')) {
        inIngredients = true;
        inSteps = false;
        continue;
      }
      if (line.includes('做法') || line.includes('步骤') || line.includes('制作')) {
        inIngredients = false;
        inSteps = true;
        continue;
      }
      if (line.includes('备注') || line.includes('小贴士')) {
        inIngredients = false;
        inSteps = false;
        continue;
      }

      if (inIngredients) {
        const cleaned = line.replace(/^[\d.。、\s]*|\*$/g, '').trim();
        if (cleaned) result.ingredients.push(cleaned);
      } else if (inSteps) {
        const cleaned = line.replace(/^[\d.。、\s]*|\*$/g, '').trim();
        if (cleaned) result.steps.push(cleaned);
      } else if (!result.notes) {
        result.notes = line;
      }
    }

    if (!result.ingredients.length) {
      for (let i = 1; i < Math.min(6, lines.length); i++) {
        const cleaned = lines[i].replace(/^[\d.。、\s]*|\*$/g, '').trim();
        if (cleaned) result.ingredients.push(cleaned);
      }
    }

    setParsedRecipe(result);
  };

  const handleUrlImport = async () => {
    if (!url.trim()) {
      alert('请输入网页地址');
      return;
    }
    alert('网页导入功能需要后端支持，目前仅支持文本导入。\n\n请使用文本导入功能，将菜谱内容粘贴到文本框中。');
  };

  const handleSave = () => {
    if (!parsedRecipe) return;
    
    addRecipe({
      name: parsedRecipe.name,
      category: '家常菜',
      ingredients: parsedRecipe.ingredients,
      steps: parsedRecipe.steps,
      notes: parsedRecipe.notes,
      image: '',
    });
    
    setImportSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 1500);
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
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
              activeTab === 'text'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            文本导入
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
              activeTab === 'url'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="w-5 h-5" />
            网页导入
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'text' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  粘贴菜谱文本
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => {
                    setTextContent(e.target.value);
                    setParsedRecipe(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={12}
                  placeholder="示例格式：

番茄炒蛋
食材：
番茄2个
鸡蛋3个
盐适量

做法：
1. 番茄洗净切块
2. 鸡蛋打散
3. 锅中放油..."
                />
              </div>
              <button
                onClick={parseTextRecipe}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                解析菜谱
              </button>

              {parsedRecipe && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">解析结果</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">菜名</label>
                      <p className="font-medium">{parsedRecipe.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">食材</label>
                      <ul className="space-y-1">
                        {parsedRecipe.ingredients.map((ing, i) => (
                          <li key={i} className="text-sm">{ing}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">步骤</label>
                      <ol className="space-y-1">
                        {parsedRecipe.steps.map((step, i) => (
                          <li key={i} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </div>
                    {parsedRecipe.notes && (
                      <div>
                        <label className="text-sm text-gray-500">备注</label>
                        <p className="text-sm">{parsedRecipe.notes}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSave}
                    className="mt-4 w-full py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                  >
                    保存菜谱
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  菜谱网页地址
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://example.com/recipe.html"
                />
              </div>
              <button
                onClick={handleUrlImport}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                抓取网页内容
              </button>
              <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                提示：网页导入功能需要后端API支持，目前暂未实现。请使用文本导入功能。
              </div>
            </div>
          )}
        </div>
      </div>

      {importSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">导入成功</h3>
            <p className="text-gray-500">正在返回首页...</p>
          </div>
        </div>
      )}
    </div>
  );
}