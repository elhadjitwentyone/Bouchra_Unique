# Bouchra Unique Interior

Site de la boutique (Next.js + Tailwind), avec un espace d'administration sur `/admin`
pour modifier les produits, les photos et les textes du site.

## Administration (`/admin`)

- Sections : Produits, Page d'accueil, Personnalisation, Showroom, Avis clients, Infos du site.
- Une sauvegarde crée un commit dans ce dépôt (`data/content.json`, `public/uploads/`) ;
  Vercel redéploie automatiquement le site (~1 minute).

### Variables d'environnement à configurer sur Vercel

| Variable | Rôle |
| --- | --- |
| `ADMIN_PASSWORD` | Mot de passe de connexion à `/admin`. |
| `GITHUB_TOKEN` | Jeton d'accès GitHub (fine-grained, droit *Contents: Read and write* sur ce dépôt), utilisé par l'admin pour publier les modifications. |
| `GITHUB_REPO` | `elhadjitwentyone/bouchra_unique` |
| `GITHUB_BRANCH` | `main` (optionnel, valeur par défaut) |
| `NEXT_PUBLIC_WHATSAPP` | déjà configuré — non utilisé par le nouveau code (le numéro WhatsApp se gère maintenant dans `/admin/site`). |

## Développement local

```bash
npm install
npm run dev
```
