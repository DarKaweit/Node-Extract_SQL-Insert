<!DOCTYPE html>
<html>

<head>

		<title>README - Quickstart 2.1</title>

		<meta http-equiv="content-type" content="text/html; charset=UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">

		<link href="mystyle_c.css" rel=" stylesheet " type="text/css"/>	

</head>		
		
<body>
<charset utf-8>
<h1>NodeJs/API Gmail Quickstart 2.1 (modifiée le 22/05/2018)</h1>

<hr>
<strong>Extraction d'une pièce jointe en utilisant l'API Gmail afin de récupérer un tableau qui sera parsé pour insérer les données en base SQL.</strong>
<hr>
ATTENTION : Cet outil est encore en phase de tests, donc utilisez le en connaissance de cause...<br /><br />
 <i>Note du 22 Mai 2018 :<br />Vous pouvez désormais utiliser le programme 'quickstart-2.1.js'. Celui-ci permet de récupérer automatiquement plusieurs mails et plusieurs pièces jointes. De plus, il corrige une erreur d'insertion des nouveaux mails.
<br />Des optimisations sont encore à venir : récupération de la date d'arrivée du Mail, gestion des messages d'erreur à revoir, possibilité de travailler sous MariaDB...</i><br /><br />

Vous devez au préalable avoir disposer des modules 'node.js' et 'mysql' et avoir installé une base de donnée Mysql ou Mysql2.<br />

Dans un premier temps le programme va se connecter à l'aide du fichier "client_secret" que vous récupérerez sur la console de l'API<a href="https://console.cloud.google.com/apis/"></a>.<br />

"quickstart-2.1.js" va par la suite chercher un mail contenant "whitform.xlsx" comme chaîne de caractère. Une fois le mail trouvé il va récupérer l'id qui correspond à la pièce jointe afin de prendre les données en 'base64'.

Les modules de parsage nous servirons à découper le fichier '.xlsx' vers du '.csv', puis à l'insertion des données en base de données.
<br><br>
Configurez par la suite le contenu du 'quickstart-2.1.js' (chemins vers vos répertoires de sauvegarde, modules complémentaires...).

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
<li>mysql2</li>
</ul>

Un grand merci à tous les participants de SakanaPoisson !

<i>by DarKaweit et Yanniscode !</i># Extract-Node-Insert-SQL
</body>