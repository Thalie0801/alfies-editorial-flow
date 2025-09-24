import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, MessageCircle, X, Send } from "lucide-react";

export function AlfieChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis Alfie, votre copilot éditorial. Comment puis-je vous aider aujourd'hui ?",
      isBot: true
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickQuestions = [
    "Quels sont les tarifs ?",
    "Comment fonctionne Alfie ?",
    "Qu'est-ce que Fynk ?",
    "Programme Ambassadeurs ?"
  ];

  const handleQuickQuestion = (question: string) => {
    const responses: { [key: string]: string } = {
      "Quels sont les tarifs ?": "Nos plans commencent à 79€/mois pour Essential avec essai 7j gratuit. Starter à 179€/mois et Pro à 399€/mois. Tous incluent l'affiliation 10-15% !",
      "Comment fonctionne Alfie ?": "Je suis votre assistant IA qui vous guide dans l'onboarding, propose des sujets, optimise votre contenu et analyse vos KPIs. Je parle vraiment comme vous !",
      "Qu'est-ce que Fynk ?": "Fynk est notre add-on d'engagement qui amplifie votre visibilité de +30-60% avec des routines automatisées et sécurisées. Bundle -10% avec Æditus !",
      "Programme Ambassadeurs ?": "50 places exclusives avec commissions jusqu'à 15%, accès prioritaire et primes. Option Elite : 15% garanti 12 mois pour les 10 premiers !"
    };

    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: question, isBot: false },
      { id: Date.now() + 1, text: responses[question] || "Merci pour votre question ! Un expert vous recontactera bientôt.", isBot: true }
    ]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: inputValue, isBot: false },
      { id: Date.now() + 1, text: "Merci ! Voulez-vous recevoir notre guide complet par email ? 📧", isBot: true }
    ]);
    setInputValue("");
  };

  return (
    <>
      {/* Floating Sticker */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-primary shadow-primary hover:scale-110 transition-all duration-300 animate-glow"
            size="icon"
          >
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </Button>
        )}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 z-50 bg-card border border-border/50 shadow-2xl flex flex-col animate-fade-in-scale">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-primary rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-primary-foreground">Alfie</div>
                <div className="text-xs text-primary-foreground/80">Copilot Æditus</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-gradient-primary text-primary-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground text-center">Questions rapides :</div>
                {quickQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-xs h-8"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tapez votre question..."
                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="icon" onClick={handleSend} className="bg-gradient-primary">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}