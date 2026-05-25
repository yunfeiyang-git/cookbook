import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import { RecipeDetail } from '@/pages/RecipeDetail';
import { CreateRecipe } from '@/pages/CreateRecipe';
import { EditRecipe } from '@/pages/EditRecipe';
import { ImportRecipe } from '@/pages/ImportRecipe';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/edit/:id" element={<EditRecipe />} />
          <Route path="/import" element={<ImportRecipe />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;