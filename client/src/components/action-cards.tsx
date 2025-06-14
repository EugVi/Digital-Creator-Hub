import { useLanguage } from "@/hooks/use-language";
import { Lightbulb, CheckCircle, Megaphone, Loader2 } from "lucide-react";

interface ActionCardsProps {
  onGenerateIdea: () => void;
  onValidateIdea: () => void;
  onGenerateKit: () => void;
  loading: {
    generateIdea: boolean;
    validateIdea: boolean;
    generateKit: boolean;
  };
}

export default function ActionCards({ 
  onGenerateIdea, 
  onValidateIdea, 
  onGenerateKit, 
  loading 
}: ActionCardsProps) {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Lightbulb,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      title: t('actions.generateIdea.title'),
      description: t('actions.generateIdea.description'),
      buttonText: t('actions.generateIdea.button'),
      onClick: onGenerateIdea,
      loading: loading.generateIdea,
    },
    {
      icon: CheckCircle,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      title: t('actions.validateIdea.title'),
      description: t('actions.validateIdea.description'),
      buttonText: t('actions.validateIdea.button'),
      onClick: onValidateIdea,
      loading: loading.validateIdea,
    },
    {
      icon: Megaphone,
      bgColor: "bg-violet-100",
      iconColor: "text-violet-600",
      buttonColor: "bg-violet-600 hover:bg-violet-700",
      title: t('actions.generateKit.title'),
      description: t('actions.generateKit.description'),
      buttonText: t('actions.generateKit.button'),
      onClick: onGenerateKit,
      loading: loading.generateKit,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200"
        >
          <div className={`flex items-center justify-center w-12 h-12 ${card.bgColor} rounded-lg mb-4`}>
            <card.icon className={`${card.iconColor} text-xl`} size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {card.title}
          </h3>
          <p className="text-slate-600 mb-4">
            {card.description}
          </p>
          <button
            onClick={card.onClick}
            disabled={card.loading}
            className={`w-full px-4 py-3 ${card.buttonColor} text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center`}
          >
            {card.loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('status.processing')}
              </>
            ) : (
              card.buttonText
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
