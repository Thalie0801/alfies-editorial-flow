import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "Combien de temps dure l'essai Essential ?",
      answer: "L'essai Essential dure 7 jours et permet de tester toutes les fonctionnalités du plan Essential sans engagement. Aucune publication n'est effectuée pendant cette période d'essai."
    },
    {
      question: "Puis-je gérer plusieurs marques avec un seul compte ?",
      answer: "Actuellement, chaque compte Æditus est limité à une seule marque. Cette approche nous permet de garantir une personnalisation optimale et des performances maximales. Une option multi-marques pourra être disponible à l'avenir."
    },
    {
      question: "Comment fonctionne l'arrêt d'abonnement ?",
      answer: "Vous pouvez arrêter votre abonnement à tout moment depuis votre dashboard. L'arrêt prendra effet à votre prochaine date anniversaire. Aucun remboursement n'est effectué pour la période en cours."
    },
    {
      question: "Qu'est-ce que le programme Ambassadeur ?",
      answer: "Le programme Ambassadeur est limité à 50 places et coûte 49,90€. Il offre 10% de commission sur tous vos parrainages, puis 15% après 20 clients parrainés. Les Ambassadeurs bénéficient également d'avantages exclusifs et d'un accès prioritaire aux nouveautés."
    },
    {
      question: "Comment fonctionne l'affiliation ?",
      answer: "Tous les clients bénéficient de 10% de commission sur leurs parrainages. Les Ambassadeurs peuvent atteindre 15% après 20 clients parrainés. Les commissions sont versées mensuellement via Stripe Connect, avec un seuil minimum de 25€."
    },
    {
      question: "Qu'est-ce qu'Alfie et comment m'aide-t-il ?",
      answer: "Alfie est votre copilot éditorial intégré. Il vous guide pendant l'onboarding, propose des sujets de contenu, vérifie la cohérence de votre ton de marque, et vous donne des conseils basés sur vos KPIs. Alfie évolue avec votre marque pour des suggestions toujours plus pertinentes."
    },
    {
      question: "Puis-je valider mes contenus avant publication ?",
      answer: "Absolument ! Æditus inclut une validation humaine systématique. Vous recevez une notification in-app et par e-mail pour chaque contenu généré. Vous pouvez modifier, approuver ou refuser chaque publication avant qu'elle ne soit diffusée."
    },
    {
      question: "Quelle est la différence entre Æditus et Fynk ?",
      answer: "Æditus est l'écosystème éditorial complet qui génère et publie vos contenus. Fynk est un produit séparé qui amplifie votre engagement via des routines d'interaction intelligentes. Fynk Basic coûte 29€/mois et Fynk Pro 69€/mois."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Questions <span className="bg-gradient-primary bg-clip-text text-transparent">fréquentes</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Tout ce que vous devez savoir sur Æditus et nos services
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-4">
              Vous avez d'autres questions ?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@aeditus.fr" 
                className="text-primary hover:text-primary/80 font-semibold"
              >
                support@aeditus.fr
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Réponse sous 24h
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}