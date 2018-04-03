<h1>NodeJs/API Gmail</h1>

<hr>
<strong>Extraction d'une pièce jointe en utilisant l'API Gmail afin de récupérer un tableau qui sera parsé pour insérer les données en base SQL.</strong>
<hr>

Dans un premier temps le programme va se connecter à l'aide du fichier "client_secret" que vous récupérerez sur la <a href="https://console.cloud.google.com/apis/">console de l'API</a>. Déplacez le fichier dans le dossier racine du "quickstart.js"<br />

Il va par la suite chercher un mail contenant "fichier-sakana-whitform" comme chaîne de caractère. Une fois le mail trouvé il va récupérer l'id qui correspond à la pièce jointe afin de prendre les données en base64.

Les modules de parsage nous servirons à découper le XLSX vers du CSV, puis l'insertion des données en base.

Configurez par la suite le contenu du quickstart.js.

<h2>Modules utilisées</h2>

<ul>
<li>google-auth-library</li>
<li>body-parser</li>
<li>node-schedule</li>
<li>googleapis</li>
<li>readline</li>
<li>csv-parse</li>
<li>node-xlsx</li>
<li>mysql2</li>
<li>fs</li>
</ul>

Un grand merci à tous les participants de SakanaPoisson !

<i>by DarKaweit !</i># Extract-Node-Insert-SQL
