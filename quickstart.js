
/*------------------------------------------------------------------------
  Modules node installés pour l'utilisation de l'extraction et le parsage
-------------------------------------------------------------------------*/
var googleAuth = require('google-auth-library');
var bodyparser = require('body-parser');
var schedule   = require('node-schedule');
var google     = require('googleapis');
var readline   = require('readline');
var parse      = require('csv-parse');
var xlsx       = require('node-xlsx');
var mysql      = require('mysql2');
var fs         = require('fs');

/*------------------------------------------------------------------------//
//                                                                        //
//               MODULE DE TÉLÉCHARGEMENT DE LA PIÈCE JOINTE              //
//                                                                        //
//------------------------------------------------------------------------*/

/*------------------//
// 1_Téléchargement //
//------------------*/

/*------------------------------------------------------------------------
Si vous modifiez ces étendues, supprimez vos informations d'identification 
précédemment enregistrées sur ~/.credentials/gmail-nodejs-quickstart.json
-------------------------------------------------------------------------*/
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

/*------------------------------------------------------------------------
      Charger les secrets du client à partir d'un fichier local.
-------------------------------------------------------------------------*/
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Erreur du chargement du fichier "client secret": ' + err);
    return;
  }

  /*------------------------------------------------------------------------
      Autorisez un client avec les informations d'identification chargées, 
      puis appelez l'API Gmail.
  -------------------------------------------------------------------------*/
  authorize(JSON.parse(content), listMail);
});

/*------------------------------------------------------------------------
 Créez un client OAuth2 avec les informations d'identification données,
 puis exécutez la fonction de rappel donnée.
-------------------------------------------------------------------------*/
/**
* @param {Object} credentials Les informations d'identification du client d'autorisation.
* @param {function} callback  Le rappel à appeler avec le client autorisé.
*/

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  /*------------------------------------------------------------------------
               Vérifiez si nous avons déjà stocké un jeton.
  -------------------------------------------------------------------------*/
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/*------------------------------------------------------------------------
Récupérez et enregistrez un nouveau jeton après avoir demandé l'autorisation
de l'utilisateur, puis exécutez le rappel donné avec le client OAuth2 autorisé.
-------------------------------------------------------------------------*/
/**
* @param {google.auth.OAuth2} oauth2Client Le client OAuth2 pour obtenir un jeton.
* @param {getEventsCallback} callback Le rappel à appeler avec le client autorisé
*/

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Autoriser cette application en visitant cette url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Entrez le code de cette page ici: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Erreur lors de la tentative de récupération du jeton d\'accès', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
/*------------------------------------------------------------------------
Stocker le jeton sur le disque peut être utilisé dans les exécutions de 
programme ultérieures.
-------------------------------------------------------------------------*/
/**
 * @param {Object} token Le jeton à stocker sur le disque.
 */

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Jeton stocké sur ' + TOKEN_PATH);
}

/**
 * @param {google.auth.OAuth2} auth Un client OAuth2 autorisé.
 */
 
 
console.log(`\n -----------------------------------------------------------------------------\n\n                      EXTRACTION, PARSAGE, INSERTION `);
/*------------------------------------------------------------------------
          Récupération de l'id du mail possèdant (fichier-sakana).
-------------------------------------------------------------------------*/
console.log('\n -----------------------------------------------------------------------------');
console.log(' \n ---');

function listMail(auth) {

  console.log('\n\n [1] -- Recherche d\'un nouveau mail contenant "fichier-sakana-whitform". --');

  let gmail = google.gmail('v1');
  let fichierPj = 'fichier-sakana-whitform';

  gmail.users.messages.list({
    auth: auth, // Utilise l'authentification Oauth 
    userId: 'me',
  },
    {
      qs: { q: fichierPj }
    }, // Recherche les message venant d'un expéditeur spécifié (unread à enlever si nécessaire).
    function (err, results) {
      var fichierPj = 'fichier-sakana-whitform';
      if (typeof fichierPj >= results.messages[0].id) {
        console.log('\n    -> Un nouveau mail contenant la pièce jointe à été trouvé !' + '\n');
      } else {
        console.log('\n    -> Pas de mail trouvé avec la pièce jointe "fichier-sakana-whitform" ' + '\n');
      };
  
      recupIdAttachment(auth, results.messages[0].id); // Apelle la fonction "recupIdAttachment"
    });

};


/*------------------------------------------------------------------------
              Récupération de l'id de la pièce jointe.
-------------------------------------------------------------------------*/
function recupIdAttachment(auth, id) {
  console.log(' \n ---');
  console.log('\n [2] -- Recherche l\'id de la pièce jointe "fichier-sakana-whitform". --');
  let gmail = google.gmail('v1');

  gmail.users.messages.get({ // Accèdes aux informations
    auth: auth, // Utilise l'authentification Oauth 
    userId: 'me', // Charge le fichier secret.
    id: id,
  },
    function (err, results) {
      if (err) {
        console.log('\n La connexion sur l\'api à échoué. Vérifiez les paramètres de connexion sur "quickstart.js" ' + err);
        return;
      }
      var attachment = results.payload.parts[1].body.attachmentId;
      if (attachment == 0) {
        console.log('\n    -> La pièce jointe rencontre une erreur.');
      } else {
        console.log('\n    -> L\'id de la pièce à été identifié! ')
      }
      recupData(auth, results.payload.parts[1].body.attachmentId); // Apelle la fonction "recupIdAttachment"
    });
};

/*------------------------------------------------------------------------
            Récupération du DATA puis stockage interne (parser).
-------------------------------------------------------------------------*/

function recupData(auth, id) {
  console.log(' \n ---');
  console.log('\n\n [3] -- Récupération des données de "fichier-sakana-whitform". --');

  let gmail = google.gmail('v1');

  gmail.users.messages.attachments.get({
    auth: auth,
    id: id,
    messageId: id,
    userId: 'me',

  }, function (err, results) {
    if (err) {
      console.log('\n    -> Pas de données à récupérer.' + err);
    } else {
      console.log('\n    -> Données trouvées ! Déplacement du fichier...');
    }
    fs.writeFile("./Tables/XLSX/fichier-sakana-whitform.xlsx", results.data, 'base64', function (err, results) {
      if (err) {
        console.log('\n La connexion à échoué, vérifiez les paramètres.' + err);
      } else {
        console.log('\n    -> Téléchargement pour le parsage. Voir dossier Tables/XLSX.');
      }
      parseXlsx();
    });
  });
};

/*------------------//
//     2_Parsage    //
//------------------*/

// Référence du module: https://stackoverflow.com/questions/34342425/convert-xls-to-csv-on-the-server-in-node
function parseXlsx() {

  console.log(' \n ---');
  console.log('\n\n [4] -- Analyse et parsage du tableau. --');
  // Description de la table.
  var obj = xlsx.parse(__dirname + '/Tables/XLSX/fichier-sakana-whitform.xlsx');
  var rows = [];
  var writeStr = "";
  var csvData = [];


  console.log('\n    -> Découpe suivant les paramètres inserés dans "quickstart.js".')
  for (var i = 0; i < obj.length; i++) {
    var sheet = obj[i];

    for (var j = 0; j < sheet['data'].length; j++) {
      rows.push(sheet['data'][j]);
    }
  }

  for (var i = 0; i < 68; i++) {
    writeStr += rows[i].join("|") + ("\n")
  }

  fs.writeFile(__dirname + "/Tables/CSV/fichier-sakana-whitform.csv", writeStr, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('\n    -> Le fichier à bien été découpé. Créer dans le dossier "Tables/CSV".');
    }

    // Paramètre de découpe.
    const config =
      {
        parserOptions: {
          relax_column_count: true, // Ne prend pas en compte les cellules vides
          delimiter: '|',
          quote: false,
          relax: true, // Preserve quotes in row
          trim: true, // Supprime les espaces en début et fin de cellules
        }
      };

    fs.createReadStream(__dirname + '/Tables/CSV/fichier-sakana-whitform.csv')


      .pipe(parse(config.parserOptions))

      .on('data', function (csvrow) {
        csvData.push(csvrow);
      })

    console.log(' \n ---');
    console.log('\n\n [5] -- Envoi des données sur la base. --');
    var con = mysql.createConnection
      ({
        host: "localhost",
        port: "8889",
        user: "root",
        password: "root",
        database: "bdd_sakanatest"
      });
    con.connect(function (err) {
      if (err) throw err;
      console.log('\n    -> La connexion à la base de donnée est établi !');
      console.log('\n    -> Exécutions des insertions "INSERT INTO".')
      var sql = "INSERT INTO dates (value_date_xlsx) VALUES ?";
      var values = [[csvData[1][1]],];

      //var insertDate = new Date((values - (25567 + 2))*86400*1000);

      con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log('\n    -> Nombre d\'éléments inséré:' + ' ' + result.affectedRows);
        console.log(' \n ---');
        console.log('\n \n-----------------------------------------------------------------------------\n \n');
        con.end();    
      });
    });
  });
};

