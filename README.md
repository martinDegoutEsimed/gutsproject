# gutsproject

Application pour projet « Cap ou pas Cap »


Description technique + Schéma : 
-	Nom : « Guts »
-	Plateforme : Web 
-	Stockage des données : MySQL
-	Langage de programmation : Node.js


Liste des exigences : 
-	E1 : Créer un compte personnel -
-	E2 : Modifier compte personnel - 
-	E3 : Créer un défi - 
-	E4 : Chaque défi ne doit pas dépasser 140 caractères -
-	E5 : Un défi ne peut pas être modifié -
-	E6 : Les utilisateurs peuvent liker un défi -
-	E7 : Les utilisateurs peuvent réaliser un défi - 
-	E8 : Si un défi n’a aucun like ou n’est réalisé, il peut être supprimé par son auteur -
-	E9 : Si un défi n’a pas été réalisé ou si personne n’a mis de commentaire, il peut être masqué par son auteur (seul ce dernier pourra alors le voir ainsi que les like associés) -
-	E10 : Les utilisateurs peuvent commenter un défi - 
-	E11 : Chaque commentaire ne doit pas dépasser 140 caractères -
-	E12 : Chaque utilisateur doit pouvoir s’authentifier et se déconnecter -
-	E13 : Les utilisateurs peuvent lister les défis créés -
-	E14 : Les utilisateurs peuvent trier les défis par nombre de like -
-	E15 : Les utilisateurs peuvent trier les défis par date de création -
-	E16 : Les utilisateurs peuvent choisir d’afficher ou non les défis déjà marqués comme « réalisés » -
-	E17 : Le choix de l’utilisateur sur le point E16 doit être sauvegardé et ne pas changer entre 2 connexions -
-	E18 : Les utilisateurs peuvent liker un défi depuis la liste - 
-	E19 : Les utilisateurs peuvent liker un défi depuis sa page de détails -
-	E20 : Les utilisateurs peuvent envoyer une photo de preuve de réalisation d’un défi - 
-	E21 : Les utilisateurs peuvent envoyer une vidéo de preuve de réalisation d’un défi - 
-	E22 : L’auteur d’un défi peut approuver ou non une réalisation de son défi et le marquer comme « réalisé » -
-	E23 : Les utilisateurs peuvent retirer leurs Like -
-	E24 : Les utilisateurs peuvent modifier leurs commentaires -
-	E25 : Les utilisateurs peuvent modifier leurs preuves -
-	E26 : Les utilisateurs peuvent ajouter des défis à leur liste de suivi - 
-	E27 : Les utilisateurs peuvent supprimer des défis de leur liste de suivi - 
-	E28 : Les utilisateurs peuvent voir les profils des autres utilisateurs -
-	E29 : Les défis postés par un utilisateur doivent être visibles aux autres utilisateurs -
-	E30 : Les défis réalisés par un utilisateur doivent être visibles aux autres utilisateurs -

Liste des fonctionnalités : 
-	F1 : CRUD Compte utilisateur (E1, E2)
-	F2 : CRUD Défi (E3, E8, E9)
-	F3 : Contrôle création défi (E4)
-	F4 : Contrôle modification défi (E5)
-	F5 : CRUD Like (E6, E18, E19)
-	F6 : CRUD Commentaire (E10, E24)
-	F7 : Contrôle création commentaire (E11)
-	F8 : Mise en place de l’authentification (E12)
-	F9 : CRUD Preuve (E7, E20, E21, E25)
-	F10 : Gestion liste défis (E13, E14, E15, E16, E17)
-	F11 : Mise en place de l’approbation d’un défi (E22)
-	F12 : Gestion liste suivi (E26, E27)
-	F13 : Mise en place du profil utilisateur (E28, E29, E30)

