# TODO

## Données

- remplir les JSON d'attributs et d'options (ouille) (attributs créés, règles à faire)
- ignorer les attributs qui n'ont pas de fichier(s) d'options correspondant (temporaire) ✅
- templates JSON de phrases `{firstname} {lastname} is a {age} years old {gender} {race}.`

## Attributs

- ajouter gestion option "not" dans les conditions
- gérer les attributs qui n'ont pas juste des options à pick (par exemple l'âge qui est un randint avec âge maxi) ✅
- ajouter effet multiplication de valeur pour les attributs numériques (par exemple une personne petite aura un poids réduit)

## Display

- voir ce qu'il se fait déjà dans les générateurs existants en terme de création de phrases descriptives complètes à partir d'attributs générés
- printer console un peu plus joli pour les picks
- parser templates JSON de phrases

## Autres

- Paramètres de génération (tags requis, tags exclus, etc etc etc etc.......)

# DONE

- Fonction `evaluateDependencies`, qui :
  - crée un arbre de dépendances pour déterminer l'ordre de génération de chaque attribut ✅
  - s'assure qu'il n'y a pas de dépendances circulaires ✅
- petit printer de test qui crée les instances et print leur contenu dans la console (pour voir si tout se crée comme il faut) ✅
- schémas Zod pour les JSON (comme ça on a une structure imposée qui se gère toute seule) ✅
- appliquer le schéma Zod au parsing des fichiers d'options ✅
- setup le contexte de génération (en gros qu'est ce qui a déjà été généré et qu'est ce qui reste à générer) => important pour les règles d'attributs qui ont besoin de savoir ce qu'il y a déjà. ✅ (basique)
- processing des règles d'attribut en fonction du contexte ✅
  - belle fonction `matchesCondition` qui prend une condition d'un attribut et la compare à ce qui a déjà été généré pour dire si on applique l'effet lié ou pas
  - fonction `applyEffect(nom_effet, blablabla)` qui applique un effet donné sur l'attribut quand la condition correspondante passe
- TESTER TOUT CA => CA FONCTIONNE LE POC FONCTIONNE YIPPEE ✅
