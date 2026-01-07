import { notFound } from "next/navigation";

export default function CatchAllPage() {
  notFound();
}

// Solution proposée par l'IA, la page 404 custom ne s'affichait plus
// depuis son déplacement dans le dossier [locale] suite à l'implémentation du multi-lang.
//
// Il a alors été proposé de créer une page catch-all qui redirige vers la 404
// Pour toutes les routes non définies dans l'application Next.js
// Cela permet de s'assurer que la page 404 custom est bien affichée
// même lorsque l'utilisateur tente d'accéder à une route inexistante.
//
// Ainsi, cette page catch-all utilise la fonction notFound() de Next.js
// pour rediriger automatiquement vers la page 404 custom définie dans le projet.
