import { ChefHat, Plus, Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-primary to-orange-400 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <ChefHat className="w-8 h-8" />
            <h1 className="text-xl font-bold">菜谱管理器</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">创建菜谱</span>
            </button>
            <button
              onClick={() => navigate('/import')}
              className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">导入</span>
            </button>
            <button
              onClick={() => navigate('/camera')}
              className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all hover:scale-105"
            >
              <Camera className="w-5 h-5" />
              <span className="hidden sm:inline">拍照</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}