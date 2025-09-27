export function FynkCard() {
  return (
    <div className="bg-gradient-card rounded-xl border p-6 text-center">
      <div className="text-2xl font-bold mb-2">Fynk</div>
      <p className="text-muted-foreground mb-4">Amplifiez votre engagement automatisé</p>
      <div className="space-y-2 mb-4">
         <div className="text-lg font-semibold text-primary">
           Basic: 29€/mois (~400 interactions)
         </div>
         <div className="text-lg font-semibold text-accent">
           Pro: 69€/mois (~1 500 interactions)
         </div>
      </div>
      <ul className="text-sm space-y-2 mb-6">
        <li>• Routines d'engagement automatisées</li>
        <li>• Modèles de commentaires adaptatifs</li>
        <li>• Analytics d'engagement avancés</li>
        <li>• Alfie Copilot inclus</li>
        <li>• Accès au tableau de bord</li>
        <li>• Programme ambassadeurs (15% commission)</li>
      </ul>
      <p className="text-xs text-muted-foreground">
        Fynk seul permet d'accéder au dashboard complet
      </p>
    </div>
  );
}