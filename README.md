### Pour compiler & exécuter le projet en mode développement

* Compilation `au build`
* Exécution `au run`
* Démarrage du débugger `F5`

-----------

Voir ici: https://code.visualstudio.com/tutorials/static-website/create-storage

### Pour compiler le projet pour la production (Azure)

- supprimer et recréer le rép publish
- `au build --env prod`
- copier le rép scripts dans le rép publish
- copier le rép font-awesome dans le rép publish
- copier les fichiers index.html et favicon.ico dans le rép publish
- ensuite clic droit sur le répertoire publish et choisir Deploy to static website > ushuaia


| Type                | Nom           |           |                |
|---------------------|---------------|-----------|----------------|
| Groupe de ressource | ushuaiaGroup  |           |                |
| App service         | ushuaiaApp    | backend   | Web App        |
| Compte de stockage  | ushuaia       | frontend  | Static Website |



