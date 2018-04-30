// QUICKSTART 2.0 (version qui marche n°2) : Ajout de plusieurs mails et leurs pièces jointes à la Base de Données (BDD) :

// DERNIERES MODIFICATIONS : (27/04/2018)

//***************NOTES *********************************************************************************************

//-------- utiliser le module MySQL plutôt que MySQL2 (semble plus efficace ici...)

//***************MODIFICATIONS *************************************************************************************
//-------- Ajout de fonctions 'parseCsv' et 'insertDataSql'
// option 'read' / 'unread' possible pour interroger l'API Gmail (selection des messages lus, non lus) (28/04/2018) >> un message doit être passé manuellement en mode lu sur la boîte mail pour être pris en compte effectivement comme lu.


/*------------------------------------------------------------------------
  Modules node installés pour l'utilisation de l'extraction et le parsage
-------------------------------------------------------------------------*/
let {google} = require('googleapis'); // accolades ajoutées (nouveau type d'écriture)
let googleAuth = require('google-auth-library');
let bodyparser = require('body-parser');
let schedule   = require('node-schedule');
let readline   = require('readline');
let parse      = require('csv-parse');
let xlsx       = require('node-xlsx');
const mysql      = require('mysql'); // semble mieux marcher que Mysql
let fs         = require('fs');



//---- VARIABLE POUR AJOUTER LA DATE DU JOUR (au format DD-MM-YYYY) au nom de fichiers enregistré :

let d = new Date(); 
let today = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
// console.log('date du jour : ' + today);



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
let SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
let TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials.js/';
let TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

/*------------------------------------------------------------------------
      Charger les secrets du client à partir d'un fichier local.
-------------------------------------------------------------------------*/
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('59 - Erreur du chargement du fichier "client secret": ' + err);
        return;
    }
        console.log('62 - Chargement du fichier "client secret" (API Gmail). -------------------------------------------------------------------');

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
// console.log('paramètre "credentials" : ' + credentials);
// console.log('paramètre "callback" : ' + callback);
  
    let clientId = credentials.installed.client_id;
    let clientSecret = credentials.installed.client_secret;
    let redirectUrl = credentials.installed.redirect_uris[0];
    
    let auth = new googleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

/*------------------------------------------------------------------------
                Vérifiez si nous avons déjà stocké un jeton.
-------------------------------------------------------------------------*/
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
        console.log('Allez récupérer un nouveau jeton d\'identification Gmail... \n');
        getNewToken(oauth2Client, callback);
        } else {
            console.log('100 ----------------Jeton d\'identification Gmail actuel utilisé ! \n');
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
// console.log('paramètre "oauth2Client" : '+ oauth2Client); // invisible
// console.log('paramètre "callback" : '+ callback); // invisible
    
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Autoriser cette application en visitant cette url: \n', authUrl + '\n');
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Entrez le code de cette page ici: \n', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Erreur lors de la tentative de récupération du jeton d\'accès...', err);
                return;
            } else {
                console.log('\n jeton d\'accès récupéré ! \n');
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            };
        });        
    });

}


/*----------------------------------------------------------------------------------
Stocker le jeton sur le disque afin qu'il puisse être utilisé dans les exécutions de 
programme ultérieures.
----------------------------------------------------------------------------------*/


/**
 * @param {Object} token Le jeton à stocker sur le disque.
 */
function storeToken(token) {
// console.log('paramètre "token" ######## : ' + token);

    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token)); // écriture du fichier 'gmail-nodejs-quickstart.json' contenant le jeton d'authentification
    console.log('Jeton stocké sur ' + TOKEN_PATH + '\n');

};

/**
 * @param {google.auth.OAuth2} auth Un client OAuth2 autorisé.
 */


console.log(`\n -----------------------------------------------------------------------------\n\n                      EXTRACTION, PARSAGE, INSERTION `);
/*------------------------------------------------------------------------
          Récupération de l'id du mail (fichier-sakana).
-------------------------------------------------------------------------*/ 
console.log('\n -----------------------------------------------------------------------------');
console.log(' \n ---');

function listMail(auth) {
console.log('178 - paramètre "auth" : '+ auth +'\n\n');
    
    let gmail = google.gmail('v1');
    let fichierPj = 'fichier-sakana-whitform';
//    console.log(gmail);

gmail.users.messages.list({
    'auth' : auth, // Utilise l'authentification Oauth 
    'userId' : 'me',
},
{
    qs: { //    la propriété 'qs' prend en compte de multiples requêtes sur l'API Gmail
        'q' : fichierPj +' is:read' // recherche les messages lus / non lus (option = read / unread)
    }
},

    function(err, results) {
        // console.log('paramètre results : '+ results); 
        //    console.log(gmail.users.messages);
        //    console.log(fichierPj);
        console.log('197 --------------------------------------------------------------------------------------------------------------\n   ----------SELECTION DES MAILS CONTENANT UNE OU PLUSIEURS PIECES JOINTES "fichier-sakana-whitform"---------------\n------------------------------------------------------------------------');
        console.log('\n\n [1] 198 -- Sélection d\'un mail contenant "fichier-sakana-whitform". ---------------------------\n\n');

        try {
            let mailIndex = 0;
            if (mailIndex === undefined) throw err;
            for(mailIndex = 0; mailIndex < results.messages.length; mailIndex++) { //----- modifier ici au besoin le nombre de mails que l'on veut récupérer ( de '0 <= mailIndex' à mailIndex < 'results.messages.length')
                let whitForMail = results.messages[mailIndex].id;
                console.log('203 - Nombre total de mails correspondants répertoriés dans votre boîte : ' + results.messages.length);
                console.log('\n\n\    204 -> Un mail contenant une ou plusieurs pièces jointes "fichier-sakana-whitform" à été trouvé. Identifiant du mail : '+ whitForMail +'\n');
                console.log('211 - index du mail : '+ mailIndex +'\n');
                //    console.log(results.messages[mailIndex].id + '\n\n'); 
                //    console.log(auth, whitForMail, mailIndex +'\n\n');
                recupIdAttachment(auth, whitForMail, mailIndex);    // Appelle la fonction "recupIdAttachment" 
                console.log('215 - recupIdAttachment (id du mail) : ' + auth, whitForMail, mailIndex +'\n\n');
            }                
        } catch(err) {
            console.log('\n    208 -> Aucun mail contenant une pièce jointe "fichier-sakana-whitform" n\'a été trouvé.\n');
            return err;
        }          
    });

};

//};

/*------------------------------------------------------------------------
              Récupération de l'id de la pièce jointe.
-------------------------------------------------------------------------*/

 
/** @param  {String} userId User's email address. The special value 'me'
 *  can be used to indicate the authenticated user.
 *  @param  {String} id ID of Message with attachments.
 *  @param  {String} messageId ID of Message with attachments.
*/

function recupIdAttachment(auth, id, mailIndex) {
    //  console.log('paramètre id mail : '+ id),
    //  console.log('check### id + mailIndex : '+ id, mailIndex  +'\n\n')

    console.log(' \n ---');
    console.log('\n\n [2] 242 -- Recherche des IDs de pièces jointes "fichier-sakana-whitform"... ------------------------------------------');
    console.log(' \n ---');

    let gmail = google.gmail('v1');

    gmail.users.messages.get({ // Accèdes aux informations
    'auth' : auth, // Utilise l'authentification Oauth 
    'userId' : 'me', // Charge le fichier secret.
    'id' : id
    },
    function (err, results) {
        //   console.log('show attachment "results": '+ results);        
        if (err) {
        console.log('\n 255 - Echec de votre connexion au(x) mail(s). Vérifiez les paramètres de connexion sur "quickstart.js". ' + err + '\n');
        return;
        }
        console.log('\n 258 -------- Connexion réussie à un mail : \n\n');
        for (let pjIndex = 1; pjIndex < results.payload.parts.length; pjIndex++) {
            try {
                let pj = results.payload.parts[pjIndex].body.attachmentId;
                console.log(' 262 - nombre de pièces jointes (+ 1) : ' + results.payload.parts.length +'\n\n');
//                console.log('263 - id de la pièce-jointe : \n\n' + pj +'\n\n');
                //  console.log('########## test 1 - PJ !!! '+ auth, id, mailIndex, pj, PjIndex +'\n');     
                //  console.log('recupData : ' + auth, id, mailIndex, pj, pjIndex + '\n\n');
                //  console.log('\n    -> Pièce jointe "fichier-sakana-whitform.xlsx" identifiée sous le numéro : \n\n'+ pj +'\n\n');
                console.log('\n    267 -> Pièce jointe "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.xlsx" identifiée sous le numéro de  "pj" : \n\n'+ pj +'\n\n 267 - index pièce jointe : '+ pjIndex +'\n\n');
                recupData(auth, pj, mailIndex, pjIndex);    // Appelle la fonction "recupData"
            }        
            catch (err) {
                console.log('\n    -> 271 - Pièce jointe "fichier-sakana-whitform" non reconnue. \n');
            };        
        };    
    });

};
/*------------------------------------------------------------------------
            Téléchargement des pièces jointes (.xlsx) / récupération du 'Data' :
-------------------------------------------------------------------------*/
function recupData(auth, id, mailIndex, pjIndex, idpj) {
    //    console.log('############ test 2 - PJ !!! '+ auth, id, pjIndex);
    console.log('\n\n\n\n [3] 285 -- Récupération des données d\'une pièce jointe "fichier-sakana-whitform.xlsx". -------------------- \n\n');
    let gmail = google.gmail('v1');
    gmail.users.messages.attachments.get({
        'auth': auth,
        'id': id,
        'messageId': id,
        'userId': 'me'
    },    
    function (err, results) {
    //  console.log('get attachment infos'+ auth, id, 'me')
        try {
            console.log('\n\n    ---------->>> 303 - fichier(s) "fichier-sakana-whitform.xlsx" trouvé(s) :  \n');
            //  "fichier-sakana-whitform-'+ today +'-'+ id +'__'+ pjIndex +'.xlsx" trouvé(s) !...');
            console.log(__dirname +'/tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.xlsx \n\n')        
            
            fs.writeFile(__dirname +'/tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.xlsx', results.data, 'base64', function (err, results) {                
                try {
                    console.log('\n    303 -> Téléchargement de pièce jointe... Enregistrées sous : "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.xlsx" dans le dossier "./tableaux/xlsx". \n\n');                
                    //    console.log('########### test 4 !!!' + auth, id, pjIndex, mailIndex, idpj + "\n\n");
                    parseXlsx(auth, id, pjIndex, mailIndex, idpj);
                } catch (err) {
                    console.log('\n 308 - Le téléchargement à échoué. Vérifiez les paramètres.\n' + err);
                    return;
                }
            });            
        }        
        catch (err) {
            console.log();
            console.log('\n\n    ----------<<< 300 - Aucun fichier à récupérer.' + err + '\n');
            //  console.log('############# test 3 !!! ' + auth, id, pjIndex);
            return;
        } 
    });

};


////////////----------------------------------------------////////////
  ////////  MODULE DE CONVERSION NODE-XLSX (XLSX --> CSV )  ////////
////////////----------------------------------------------////////////
  
// Référence du module: https://stackoverflow.com/questions/34342425/convert-xls-to-csv-on-the-server-in-node

    //  console.log('infos "id, mailIndex, pjIndex, pj" : '+ id, mailIndex, pjIndex, idpj);
console.log(' \n ---');
console.log('\n\n [4] -- 325 - Analyse et parsage du tableau. -- \n');

//**** on declare les applications :
// const fs = require('fs');    // déjà déclaré
// const xlsx = require('node-xlsx');   // déjà déclaré

let rows = [];
let writeStr = "";

function parseXlsx(auth, id, pjIndex, mailIndex, idpj) {
    const obj = xlsx.parse(__dirname + '/tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.xlsx'); // Parser un fichier EXCEL --> référence de la pièce-jointe indiquée ici.
    //---- faire une boucle traversant les lignes ('i' = 1 ligne) du fichier '.xlsx' 
    //     --> la variable 'sheet' contient toutes les lignes du tableau '.xlsx' :    

    for(let i = 0; i < obj.length; i++) {
        let sheet = obj[i];
    
        //---- faire une autre boucle ('j' = 1 colonne) traversant toutes les données (= sheet['data']) du fichier .xlsx   
        for(let j = 0; j < sheet['data'].length; j++) {
            //---- ajouter les données sélectionnées ('sheet[data][j]') au fichier '.csv'        
            rows.push(sheet['data'][j]);
        };  
    };
 
  //---- ECRITURE du fichier XLSX dans un fichier (temporaire ?) '.csv': 
  
  //---- les champs sont séparés par des "|", et les retours à la ligne indiqués par "\n"
  
  //****** Question en suspend : on décidera peut-être d'envoyer le CSV dans une réponse au lieu d'un fichier, sans passer par l'étape fichier temporaire ???
  
  //---- ligne originelle (utilisable si l'on veut toutes les lignes du tableau d'un coup)
  // for(let i = 0; i < rows.length; i++) 
  
    for(let i = 0;  i < 68; i++) {// On s'arrêtera dans un premier temps à la ligne 68 (= fin de la feuille 1), sinon : remplacer i par 'row.length'
        writeStr += rows[i].join("|") + ("\n");
    };  //    fin boucle 'for'
    fs.writeFile(__dirname + '/tableaux/csv/fichier-sakana-whitform-'+ today + '-'+ mailIndex +'__'+ pjIndex +'.csv', writeStr, function(err) {
        if(err) {
            return console.log('367 - Fichier ".csv" non sauvegardé.' + err);
        }
        console.log('"fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.csv" a été sauvegardé dans le répertoire courant');
        parseCsv(pjIndex, mailIndex);
    });
        
/*   
        fs.writeFile(__dirname + '/tableaux/csv/fichier-sakana-whitform-'+ today + '-'+ mailIndex +'__'+ pjIndex +'.csv', csvSheet, function(err) {  
            try {                          
                console.log('"fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.csv" a été sauvegardé dans le répertoire courant');
                parseCsv(pjIndex, mailIndex);
            } catch (err) {
            //    throw err;
            //    console.log('370 - Fichier ".csv" non sauvegardé.' + err);     
            };
        });
*/

//    };   //    fin boucle 'for'
    

};   // fin de fonction parseXlsx


  
    ////////////----------------------------------------------////////////
        ////////           MODULE DE PARSAGE (CSV-PARSE)        --////////
    ////////////----------------------------------------------////////////
    
    //---- voir : https://github.com/adaltas/node-csv-parse/issues/166
    
    //---- Déclaration des modules :
    
    // let xlsx = require('node-xlsx');    //**** déjà déclaré
    // let parse = require('csv-parse');   //**** déjà déclaré   
    // let fs = require('fs');             //**** déjà déclaré
    let csvData=[];      

function parseCsv(pjIndex, mailIndex) {
    //---- déclaration de variables supplémentaires   
    //---- Options de parsage :    
    const config = {
        parserOptions: {
            delimiter: '|',             // délimiteur de champs
            trim: true,                 // option permettant de supprimer les blancs en début et fin de cellules
            relax_column_count: true,   // ignore les colonnes inconsistantes
        }
    };
    //---- LECTURE du fichier parsé ('.csv') :   
    fs.createReadStream(__dirname + '/tableaux/csv/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.csv')   
    //----Prise en compte des options déclarées :       
    .pipe(parse(config.parserOptions))   
    //---- Prise en compte des données parsées et conversion en données de tableau Javascript : 
    .on('data', function(csvrow) {    
        csvData.push(csvrow);
        //  console.log('ligne parsée');
    }) 
    //**** lecture des données parsées à partir du fichier '.csv' (converties en tableau lisible par MySQL)   
    .on('end', function writeCsv(err, result) { // modifié : function(err)
        try {           
            //  console.log('affichage des donnees parsées :');
            console.log('411 - "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ pjIndex +'.csv" a été parsé. \n\n');     connectToSql();       
//            con.connect();
//            console.log('436 - fin d\'intégration des données');

        }
        catch (err) {
            if (err) throw err;
            console.log('417 - fichier(s) non parsé');           
        }; // fin de '.on('end',...)'
//        connectToSql();
    });  // fin de fonction 'writeCsv'

};  // fin de fonction 'parseCsv'


        ////////////----------------------------------------------////////////
            ////////       CONNEXION A LA BASE DE DONNEE (MYSQL)      ////////
        ////////////----------------------------------------------////////////
        
        //---- variables de connexion à la bdd MySQL (car elle ne marche pas pour moi encore en Mariadb)
        
//            const mysql = require('mysql');
const con = mysql.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_sakana"
});
    
  function connectToSql() {          
    con.connect(function(err) { // pour MySQL             
    //                if (err) throw err;
        try {
            console.log("Connecté !");
            insertDataSql();
        }
        catch (err) {
            //throw "Non connecté "+ err;
            console.log("451 - Non connecté \n" + err);
            return;
        }
    });
}; // fin de fonction connectToSql
//            }); // fin de fonction 'connect'

            /* 
            
            //----ALTERNATIVE, si choix de MariaDB :
            
                const nodeMaria = require('node-mariadb');
                
                const connection = nodeMaria.createConnection
                ({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "test_sakana"
                });
                
                    connection.connect(function(err) // pour MariaDB
                {
                    if (err) throw err;
                //    console.log("Connected!");
                
                */
        

    
        //*-------------------------------------------------------------------*//
        
        //*               ECRITURE dans la table 'fishing'                  *//
        
        //*-------------------------------------------------------------------*//
        
        
        //---- TRAITEMENT DE LA CELLULE DATE POUR MYSQL :

//        let csvData=[];

function insertDataSql() {

    let datesvalues = [
        csvData[1][1],
    ];
    //---- on passe d'une date au format excel (nombre de jours après le 01-01-1900) >> date voulue au format GMT :
    let formatdates = new Date((datesvalues - (25567 + 2)) * 86400 * 1000); 
    
    //---- on passe la nouvelle date au format YYYY-MM-DD :
    let reformatdates = formatdates.getFullYear() +"-"+ (parseInt(formatdates.getMonth()) + 1) +"-"+ formatdates.getDate();   
    console.log('531 - date de fichier (reformatée) : '+ reformatdates);


//*---------------------------------------------------------------------------*//

//*    REQUETE D'INSERTION (MYSQL) des données dans la table 'fishing'      *//

//*---------------------------------------------------------------------------*//

//**** référence : https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp (entre autres)


    let sql = "INSERT INTO fishing (id_specie, date, value_landing, value_quota) VALUES ?";
        
    //---- BOUCLE 'for' pour la sélection des données du tableau Javascript créé au parsage :
    for(let index = 1; index <= 17 ; index ++) {            
        let landing_specie = csvData[index+7][13];           
        
        //---- Gestion de reconnaissance des cellules vides ('not defined') en Base de données :
        
        if(landing_specie == "") {                
            landing_specie = null;
        };
        
        let quota_specie = csvData[index+7][15];

        if(quota_specie == "") {
            quota_specie = null;
        };

        let result = [index, reformatdates, landing_specie, quota_specie];
    //    result.push();            
//              console.log(result);
        
        //----  insertion des résultats en BDD :
        
        con.query(sql, [[result]], function (err, result) {                
            if (err) throw '560 - erreur d\'intégration des données. \n'+ err +'\n';           
        //    console.log('558 - erreur de connexion \n\n'+ err +'\n');
//                   console.log(result); // donne d'autres infos, si placé ici
//                   console.log('Nombre d\'enregistrements inserés dans la table "fishing": ' + result.affectedRows);
            console.log('Nombre d\'enregistrements inserés dans la table "fishing": ' + result.affectedRows);
        });
    };

    //---- REPETITIONS DE LA BOUCLE 'for' pour les autres lignes sélectionnées : 

    for(let index = 18; index <= 32 ; index ++) {            
        let landing_specie = csvData[index+9][13];           
        
        if(landing_specie == "") {                
            landing_specie = null;
        };
        
        let quota_specie = csvData[index+9][15];

        if(quota_specie == "") {
            quota_specie = null;
        };
        
        let result = [index, reformatdates, landing_specie, quota_specie];
    //    result.push();
//              console.log(result);
        con.query(sql, [[result]], function (err, result) {                
            if (err) throw err;
//            console.log('Nombre d\'enregistrements inserés dans la table "fishing": ' + result.affectedRows);
        });
    };     


    for(let index = 33; index <= 39 ; index ++) {            
        let landing_specie = csvData[index+11][13];           
        
        if(landing_specie == "") {                
            landing_specie = null;
        };
    
        let quota_specie = csvData[index+11][15];

        if(quota_specie == "") {
            quota_specie = null;
        };

        let result = [index, reformatdates, landing_specie, quota_specie];
    //    result.push();
//              console.log(result);
        
        con.query(sql, [[result]], function (err, result) {                
            if (err) throw err;
//            console.log('Nombre d\'enregistrements inserés dans la table "fishing": ' + result.affectedRows);         
        });            
    };     

    for(let index = 40; index <= 43; index ++) {   
        let landing_specie = csvData[index+24][13];

        if(landing_specie == "") {                
            landing_specie = null;
        };
    
        let quota_specie = csvData[index+24][15];

        if(quota_specie == "") {
            quota_specie = null;
        };      
        
        let result = [index, reformatdates, landing_specie, quota_specie];
    //    result.push();
//              console.log(result);
        
        con.query(sql, [[result]], function (err, result) {                
            if (err) throw err;
//            console.log('Nombre d\'enregistrements inserés dans la table "fishing": ' + result.affectedRows);
        });
    };
    console.log('632 - données d\'un tableau intégrées à la BDD ! \n\n');    
};  // fin de fonction 'insertDataSql'

//  });   //  (fin de fonction 'con.connect')

// };  // fin de fonction connectToSql

//    }); // fin de fonction ".on('end',""...)
//  console.log('637 - fin d\'intégration des données');

//  }; // fin de "function parse.xlsx"
