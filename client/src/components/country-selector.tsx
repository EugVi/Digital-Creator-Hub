import { useLanguage } from "@/hooks/use-language";
import { Globe } from "lucide-react";

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const countries = [
  { code: 'United States', flag: '🇺🇸', name: { en: 'United States', pt: 'Estados Unidos' } },
  { code: 'Brazil', flag: '🇧🇷', name: { en: 'Brazil', pt: 'Brasil' } },
  { code: 'United Kingdom', flag: '🇬🇧', name: { en: 'United Kingdom', pt: 'Reino Unido' } },
  { code: 'Germany', flag: '🇩🇪', name: { en: 'Germany', pt: 'Alemanha' } },
  { code: 'Canada', flag: '🇨🇦', name: { en: 'Canada', pt: 'Canadá' } },
  { code: 'Australia', flag: '🇦🇺', name: { en: 'Australia', pt: 'Austrália' } },
  { code: 'France', flag: '🇫🇷', name: { en: 'France', pt: 'França' } },
  { code: 'Namibia', flag: '🇳🇦', name: { en: 'Namibia', pt: 'Namíbia' } },
  { code: 'South Africa', flag: '🇿🇦', name: { en: 'South Africa', pt: 'África do Sul' } },
  { code: 'Mexico', flag: '🇲🇽', name: { en: 'Mexico', pt: 'México' } },
];

export default function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const { language, t } = useLanguage();

  const getCountryName = (country: typeof countries[0]) => {
    return country.name[language] || country.name.en;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center text-slate-700">
          <Globe className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">
            {language === 'en' ? 'Target Country:' : 'País Alvo:'}
          </span>
        </div>
        <div className="flex-1">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
          >
            <option value="">
              {language === 'en' ? 'Select a country...' : 'Selecione um país...'}
            </option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {getCountryName(country)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}