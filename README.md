<!DOCTYPE html>
<html>

<head>

		<title>README - API Gmail</title>

		<meta http-equiv="content-type" content="text/html; charset=UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">

		<link href="mystyle_c.css" rel=" stylesheet " type="text/css"/>	

</head>		
		
<body>
<charset utf-8>
<h1>NodeJs/API Gmail</h1>

<hr>
<strong>Extraction d'une pièce jointe en utilisant l'API Gmail afin de récupérer un tableau qui sera parsé pour insérer les données en base SQL.</strong>
<hr>
ATTENTION : Cet outil est encore en phase de tests, donc utilisez le en connaissance de cause...<br /><br />
 <i>Note du 2 Mai 2018 :<br />Vous pouvez désormais utiliser le programme 'quickstart-2.0.js'. Celui-ci permet de récupérer automatiquement plusieurs mails et plusieurs pièces jointes. 
<br />Des optimisations sont encore à venir : passage de la lecture d'un mail en mode 'read' après lecture, récupération de la date du Mail, gestion des messages d'erreur à revoir, possibilité de travailler sous MariaDB...</i><br /><br />

Vous devez au préalable avoir disposer des modules 'node.js' et 'mysql' et avoir installé une base de donnée Mysql.<br />

Dans un premier temps le programme va se connecter à l'aide du fichier "client_secret" que vous récupérerez sur la <a href="https://console.cloud.google.com/apis/">console de l'API</a>. Déplacez ce fichier dans le dossier racine de votre répertoire "Node-Extract_SQL-Insert"<br />

"Quickstart.js" va par la suite chercher un mail contenant "fichier-sakana-whitform" comme chaîne de caractère. Une fois le mail trouvé il va récupérer l'id qui correspond à la pièce jointe afin de prendre les données en 'base64'.

Les modules de parsage nous servirons à découper le fichier '.xlsx' vers du '.csv', puis à l'insertion des données en base de données.
<br><br>
Configurez par la suite le contenu du 'quickstart.js' (chemins vers vos répertoires de sauvegarde, modules complémentaires...).

<h3>Modules utilisées :</h3>

<ul>
<p><strong>Extraction :</strong></p>
<li>google-auth-library</li>
<li>node-schedule</li>
<li>googleapis</li>
<li>readline</li>
<br>

<p> <strong>Parsage et insertion en MySQL :</strong></p>
<li>body-parser</li>
<li>csv-parse</li>
<li>node-xlsx</li>
<li>fs</li>
<li>mysql</li>
</ul>

Un grand merci à tous les participants de SakanaPoisson !

<i>by DarKaweit et Yanniscode !</i># Extract-Node-Insert-SQL
</body>