import { useLanguage } from "@/hooks/use-language";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${
          language === 'en'
            ? 'text-blue-600 bg-blue-50 border-blue-200'
            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-slate-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pt')}
        className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${
          language === 'pt'
            ? 'text-blue-600 bg-blue-50 border-blue-200'
            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-slate-200'
        }`}
      >
        PT
      </button>
    </div>
  );
}
