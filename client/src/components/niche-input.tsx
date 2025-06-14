import { useLanguage } from "@/hooks/use-language";
import { RefreshCw } from "lucide-react";

interface NicheInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function NicheInput({ value, onChange, onClear }: NicheInputProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="niche-input" className="block text-sm font-medium text-slate-700 mb-2">
            {t('form.nicheLabel')}
          </label>
          <input
            type="text"
            id="niche-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={t('form.nichePlaceholder')}
          />
        </div>
        <button
          onClick={onClear}
          className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          <span>{t('form.clearButton')}</span>
        </button>
      </div>
    </div>
  );
}
