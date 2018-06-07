// QUICKSTART 2.1  : Ajout de plusieurs mails et leurs pièces jointes à la Base de Données BDD (version optimisée)

// DERNIERES MODIFICATIONS : (22/05/2018)


//***************MODIFICATIONS *************************************************************************************

// RECUPÉRATION DE NOUVEAUX MAILS : 
// ~~~~~~ Ajout des fonction 'mailCheck' et 'mailInsert' permettant d'insérer de nouveaux mails sans conflit avec 
// ceux existant (pour cela, une nouvelle table SQL a été créée : 'id_mails' contenant l'identifiant du mail et un 'timestamp') > voir le nouveau fichier de la Base de données (datafishuk-2.0.sql) créé à cet effet


//***************NOTES *********************************************************************************************

// ~~~~~~ MySQL2 semble plus efficace que MySQL2 ici...
// ~~~~~~ Gestion des fonctions plus logiques pour la récupération des mails et pièces-jointes
// ~~~~~~ Option message 'unread' / 'read' désactivée pour la récupération des pièces jointes de façon indifférenciée)
// ~~~~~~ Testé sous Windows et Lubuntu (testée jusqu'à 17 mails en une transaction)


//***************A FAIRE *********************************************************************************************

// ~~~~~~ Relecture du code globale (gestion d'erreur)
// ~~~~~~ Transformation du fichiers en plusieurs fichiers .js contenant les fonctions séparées

/*------------------------------------------------------------------------
  Modules node installés pour l'utilisation de l'extraction et le parsage
-------------------------------------------------------------------------*/
let {google}   = require('googleapis');     // accolades ajoutées (nouveau type d'écriture)
let googleAuth = require('google-auth-library');
let bodyparser = require('body-parser');
let schedule   = require('node-schedule');
let readline   = require('readline');
let parse      = require('csv-parse');
let xlsx       = require('node-xlsx');
let mysql2     = require('mysql2'); // semble mieux marcher que Mysql
let fs         = require('fs');

let debug = true; // gestion d'erreur


//---- VARIABLE POUR AJOUTER LA DATE DU JOUR (au format DD-MM-YYYY) au nom de fichiers enregistré :

let d = new Date(); 
let today = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
// console.log('date du jour : ' + today);


        const connection = mysql2.createConnection ({
            host: "localhost",
            user: "root",
            password: "",
            database: "test_sakana"
        });
          
        /* Begin transaction */
   //     connection.beginTransaction(function(err) {           
            //            console.log('test insertdatasql :'+ attachmentIndex, mailIndex, whitForMail);
//        if (err) { throw err; }
             
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
  process.env.USERPROFILE) + '/.credentials-api/'; // répertoire (modifiable au besoin) où est automatiquement enregistré le jeton d'accès nécessaire pour accéder à l'API Gmail (chez moi : '/home/yanniscode_bzh/.credentials' sur 'Lubuntu' et 'D:\Users\isen-user\.credentials' sur Windows)
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
/**
 *  @param  {String} id ID of Message with attachments.
*/


console.log(`\n -----------------------------------------------------------------------------\n\n                      EXTRACTION, PARSAGE, INSERTION `);
/*------------------------------------------------------------------------
          Récupération de l'id du mail (fichier-sakana).
-------------------------------------------------------------------------*/ 
console.log('\n -----------------------------------------------------------------------------');
console.log(' \n ---');

function listMail(auth, id) {

    console.log('178 - paramètre "auth" : '+ auth +'\n\n');
    
    let gmail = google.gmail('v1');
    let fichierPj = 'whitform.xlsx';
//    console.log(gmail);
    
    gmail.users.messages.list({
        'auth' : auth, // Utilise l'authentification Oauth 
        'userId' : 'me',
        'id' : id
    },
    {
        qs: { //    la propriété 'qs' prend en compte de multiples requêtes
            'q' : fichierPj/* +' is:read'*/, // recherche les messages lus / non lus (option = read / unread)
        }
    },
    
    function(err, results) {
        if (err) { throw err + '\nl.211 - Erreur de connexion à Gmail\n'};

    // console.log('paramètre results : '+ results); 
    //    console.log(gmail.users.messages);
    //    console.log(fichierPj);

        console.log('217 --------------------------------------------------------------------------------------------------------------\n   ----------SELECTION DES MAILS CONTENANT UNE OU PLUSIEURS PIECES JOINTES "fichier-sakana-whitform"---------------\n------------------------------------------------------------------------');
        console.log('\n\n [1] 217 -- Sélection d\'un mail contenant "fichier-sakana-whitform". ---------------------------\n\n');
        
        for(let mailIndex = 0; mailIndex < results.messages.length; mailIndex++) { //----- modifier ici au besoin le nombre de mails que l'on veut récupérer ( de '0 <= mailIndex' à mailIndex < 'results.messages.length')
            
            try {
                let whitForMail = results.messages[mailIndex].id;
                console.log('228 - whitForMail :');
                console.log(whitForMail);
                console.log('225 - Nombre total de mails correspondants répertoriés dans votre boîte : ' + results.messages.length);
                console.log('\n\n\    226 -> Un mail contenant une ou plusieurs pièces jointes "fichier-sakana-whitform" à été trouvé. Identifiant du mail : '+ whitForMail +'\n');
                console.log('227 - index du mail : '+ mailIndex +'\n');
                //    console.log(results.messages[mailIndex].id + '\n\n'); 
                //    console.log(auth, whitForMail, mailIndex +'\n\n');                
//                console.log('227 - recupIdAttachment (id du mail) : ' + auth, whitForMail, mailIndex +'\n\n');
                mailCheck(auth, whitForMail, mailIndex);
//                recupIdAttachment(auth, whitForMail, mailIndex, whitForMail);    // Appelle la fonction "recupIdAttachment"
                }                
            catch(err) {
                console.log('\n    235 -> erreur (connexion ?)\n');
                return err;
            }
                  
        };
       
    });

}; // fin de fonction listMail



/*------------------------------------------------------------------------
            Vérification des mails (s'ils existent déjà en Base de Données, on ne les prend pas)
-------------------------------------------------------------------------*/
function mailCheck(auth, whitForMail, mailIndex) {
    //    console.log('mailCheck :'+ auth, whitForMail, mailIndex, whitForMail);
       
    let index;
    let mail_add = "";

    if(debug) {
        console.log("DEBUG WHITMAIL");
        console.log(whitForMail);
    }         
    let mailCount = connection.query('SELECT mail_number FROM id_mails WHERE mail_number = ?', whitForMail, function (err, results) {
        
        if(results.length > 0) {
            console.log("304 - la donnée est déjà présente");
            console.log(results);
        } else {
            console.log('#########################');
            console.log('308 - le résultat : ')
            console.log (results);
            mailIdInsert(auth, whitForMail, mailIndex);
        }

    });
            
}; // fin de fonction mailCheck
    


function mailIdInsert(auth, whitForMail, mailIndex) {
    let mailInsert = connection.query('INSERT INTO id_mails (mail_number) VALUES (?)', whitForMail, function (err, results) { 
//            let mailInsert = connection.query('INSERT INTO id_mails (mail_number) VALUES (?) ON DUPLICATE KEY UPDATE mail_number=mail_number',  whitForMail, function (err, result) { // ALTERNATIVE : option qui met à jour les 'mail_number' mais ajoute les données de tous les champs mis à jour dans la BDD, même quand il n'y a rien de nouveau !                             
         
        if (err) {
            console.log('///////////////////////');
            console.log('102 - mailInsert values: ')
            console.log (results);
//                throw err;
        } else {                 
            console.log('#########################');
            console.log('107 - mailInsert values: ')
            console.log (mailInsert.values);
            console.log('#########################');
            console.log('result :')
            console.log(results);
            console.log('313 - mailInsert :'+ mailIndex, whitForMail);
            recupIdAttachment(auth, whitForMail, mailIndex, whitForMail);                 
        };
    });                    
};



function mailIdInsert(auth, whitForMail, mailIndex) {
    let mailInsert = connection.query('INSERT INTO id_mails (mail_number) VALUES (?)', whitForMail, function (err, results) { 
//            let mailInsert = connection.query('INSERT INTO id_mails (mail_number) VALUES (?) ON DUPLICATE KEY UPDATE mail_number=mail_number',  whitForMail, function (err, result) { // ALTERNATIVE : option qui met à jour les 'mail_number' mais ajoute les données de tous les champs mis à jour dans la BDD, même quand il n'y a rien de nouveau !                             
            
            if (err) {
                console.log('///////////////////////');
                console.log('102 - mailInsert values: ')
                console.log (results);
//                throw err;
            } else {                 
                console.log('#########################');
                console.log('107 - mailInsert values: ')
                console.log (mailInsert.values);
                console.log('#########################');
                console.log('result :')
                console.log(results);
                console.log('313 - mailInsert :'+ mailIndex, whitForMail);
                recupIdAttachment(auth, whitForMail, mailIndex, whitForMail);                 
            };
        });                    
    };


//    }; // fin de fonction mailCheck >> placée à la fin du code global
      
              /* End transaction */        
    
    

/*------------------------------------------------------------------------
              Récupération de l'id de la pièce jointe.
-------------------------------------------------------------------------*/

 
/** @param  {String} userId User's email address. The special value 'me'
 *  can be used to indicate the authenticated user.
 *  @param  {String} id ID of Message with attachments.
 *  @param  {String} messageId ID of Message with attachments.
*/


// le paramètre 'whitForMail' devient 'id'
function recupIdAttachment(auth, id, mailIndex, whitForMail) {    //  console.log('paramètre id mail : '+ id),
      console.log('342 - check### whitForMail + mailIndex : '+ auth, id, mailIndex, whitForMail +'\n\n')

    console.log(' \n ---');
    console.log('\n\n [2] 345 -- Recherche des IDs de pièces jointes "fichier-sakana-whitform"... ------------------------------------------');
    console.log(' \n ---');

    let gmail = google.gmail('v1');

    gmail.users.messages.get({ // Accèdes aux informations
    'auth' : auth, // Utilise l'authentification Oauth 
    'userId' : 'me', // Charge le fichier secret.
    'id' : id,
    },
    function (err, results) {
        //   console.log('show attachment "results": '+ results);
        
        console.log('########### -358 -'+ whitForMail +'\n'+ err);

        if (err) {
        console.log('\n 361 - Echec de votre connexion au(x) mail(s). Vérifiez les paramètres de connexion sur "quickstart.js". ' + err + '\n');
        return;
        }
        console.log('\n 254 -------- Connexion réussie à un mail : \n\n');
        for (let attachmentIndex = 1; attachmentIndex < results.payload.parts.length; attachmentIndex++) {
            try {
                let pj = results.payload.parts[attachmentIndex].body.attachmentId;
                console.log(' 257 - nombre de pièces jointes (+ 1) : ' + results.payload.parts.length +'\n\n');
                console.log('271 - id de la pièce-jointe : \n\n' + pj +'\n\n');
                //            console.log('########## test 1 - PJ !!! '+ auth, id, mailIndex, pj, attachmentIndex +'\n');
                //    console.log('\n    -> Pièce jointe "fichier-sakana-whitform.xlsx" identifiée sous le numéro : \n\n'+ pj +'\n\n');
                console.log('\n    279-> Pièce jointe "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx" identifiée sous le numéro de  "pj" : \n\n'+ pj +'\n\n 279 - index pièce jointe : '+ attachmentIndex +'\n\n');
//                console.log('283 - '+ auth, whitForMail, mailIndex, attachmentIndex, pj)

//                mailCheck(mailIndex, attachmentIndex, whitForMail)
                xlsxDownload(auth, pj, mailIndex, attachmentIndex, whitForMail); // recupData   // Appelle la fonction "recupData"
            }        
            catch (err) {
                console.log('286 - xlsxDownload : ' + auth, id, mailIndex, attachmentIndex + '\n\n');
                console.log('\n    -> 287 - Pièce jointe "fichier-sakana-whitform" non reconnue. \n');
                return err;
            };  
        };
    
    });

}; // fin de fonction recupIdAttachment

/*------------------------------------------------------------------------
            Téléchargement des pièces jointes (.xlsx) / récupération du 'Data' :
-------------------------------------------------------------------------*/

let gmail = google.gmail('v1');


function xlsxDownload(auth, id, mailIndex, attachmentIndex, whitForMail) {
//  console.log('305 - test 2 - PJ !!! '+ auth, id, mailIndex, attachmentIndex, whitForMail);

    console.log('\n\n\n\n [3] - 302 - Récupération des données d\'une pièce jointe "fichier-sakana-whitform.xlsx". -------------------- \n\n');

    let gmail = google.gmail('v1');

    gmail.users.messages.attachments.get({
        'auth': auth,
        'id': id,
       'messageId': id,
        'userId': 'me'
    }, 
    
    function (err, results) {
      
 
/*        if (err) {
            console.log('\n\n    ----------<<< 323 - Aucun fichier à récupérer.' + err + '\n');
        } else {*/
            console.log('\n\n    ---------->>> 312 - fichier(s) "fichier-sakana-whitform.xlsx" trouvé(s) :  \n');
            console.log('313 - fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx" trouvé(s) !...');
            console.log(__dirname +'/Tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx \n\n')         
         
            fs.writeFile(__dirname +'/Tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx', results.data, 'base64', function (err, results) {
//                console.log('317 - attachment infos + '+ auth, id, mailIndex, attachmentIndex, whitForMail +'\n');
//                console.log(data);
//                try {
                    console.log('\n    320 -> Téléchargement de pièce jointe... Enregistrées sous : "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx" dans le dossier "./Tableaux/xlsx". \n\n');                
//                    console.log('test xlsxDownload !!!' + auth, id, mailIndex, attachmentIndex, whitForMail + "\n\n");
                    parseXlsx(auth, id, mailIndex, attachmentIndex, whitForMail);
//                } catch (err) {
//                    console.log('\n 332 - Le téléchargement à échoué. Vérifiez les paramètres.\n' + err);
//                    return err;
//                }
                
            });            
//        };
    });

}; // fin de fonction recupData


////////////----------------------------------------------////////////
  ////////  MODULE DE CONVERSION NODE-XLSX (XLSX --> CSV )  ////////
////////////----------------------------------------------////////////


// Référence du module: https://stackoverflow.com/questions/34342425/convert-xls-to-csv-on-the-server-in-node

 // Description de la table.
// const fs = require('fs'); //**** on declare les applications
// const xlsx = require('node-xlsx');
// let csvData = []; (ATTENTION : Placé ici, ne récupère qu'un fichier '.xlsx')

function parseXlsx(auth, id, mailIndex, attachmentIndex, whitForMail) {
//    console.log('test parseXlsx ##############'+ auth, id, '\n'+ mailIndex, attachmentIndex, whitForMail +'\n\n');


    const obj = xlsx.parse(__dirname + '/Tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx'); // Parser un fichier EXCEL --> référence de la pièce-jointe indiquée ici.

    // console.log('infos "id, mailIndex, attachmentIndex, pj" : '+ id, mailIndex, attachmentIndex, idpj);
    console.log(' \n ---');
    console.log('\n\n [4] -- 363 - Analyse et parsage du tableau. -- \n');
    
   
    //---- faire une boucle traversant les lignes ('i' = 1 ligne) du fichier '.xlsx' 
    //     --> la variable 'sheet' contient toutes les lignes du tableau '.xlsx' :
    
    let rows = [];
    let writeStr = "";
    
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
  
  //---- ligne originelle (utilisable si l'on veut tout le tableau d'un coup)
  
  // for(let i = 0; i < rows.length; i++) 
  
  

  
    for(let i = 0;  i < 68; i++) {// On s'arrêtera dans un premier temps à la ligne 68 (= fin de la feuille 1), sinon : remplacer i par 'row.length'
        writeStr += rows[i].join("|") + ("\n");
//  }; 
        fs.writeFile(__dirname + '/Tableaux/csv/fichier-sakana-whitform-'+ today + '-'+ mailIndex +'__'+ attachmentIndex +'.csv', writeStr, function(err) {
            if (err) throw err;        
        //    console.log(err);       
        });
    };  
    console.log('"384 - fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv" a été sauvegardé dans le répertoire courant \n\n');

    parseCsv(mailIndex, attachmentIndex, whitForMail)

}; // fin de fonction parseXlsx //

  
    ////////////----------------------------------------------////////////
        ////////           MODULE DE PARSAGE (CSV-PARSE)        --////////
    ////////////----------------------------------------------////////////
    
    //---- voir : https://github.com/adaltas/node-csv-parse/issues/166
    
    //---- Déclaration des modules :
    
    // let xlsx = require('node-xlsx');    //**** déjà déclaré
    // let parse = require('csv-parse');   //**** déjà déclaré   
    // let fs = require('fs');             //**** déjà déclaré
    
    //---- déclaration de variables supplémentaires :

   

   
function parseCsv(mailIndex, attachmentIndex, whitForMail) {
//        console.log('test parseCsv ##############'+ attachmentIndex, mailIndex, whitForMail +'\n\n'); // donne les données du tableau 'csvData'

let csvData=[];    // ATTENTION ! Variable placée ici, car si au dessus de fonction parseCsv, un seul tableau est pris en compte
    
//    console.log('test csvData ##############'+ csvData +'\n\n'); // donne les données du tableau 'csvData'


    //---- Options de parsage :
    
    const config = {
        parserOptions: 
        {
            delimiter: '|',             // délimiteur de champs
            trim: true,                 // option permettant de supprimer les blancs en début et fin de cellules
            relax_column_count: true,   // ignore les colonnes inconsistantes
        }
    };
  
    //---- LECTURE du fichier parsé ('.csv') :
    
    fs.createReadStream(__dirname + '/Tableaux/csv/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv')
    
    //----Prise en compte des options déclarées :
        
    .pipe(parse(config.parserOptions))
    
    //---- Prise en compte des données parsées et conversion en données de tableau Javascript :
    
    .on('data', function(csvrow, err) 
    {    
        csvData.push(csvrow);
        //  console.log('ligne parsée');
    })
    
  
    //**** lecture des données parsées à partir du fichier '.csv' (converties en tableau lisible par MySQL)
    
    .on('end', function writeCsv(err, result) { // modifié : function(err)
    
        try {
            //  console.log('affichage des donnees parsées :');
            console.log('440 - "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv" a été parsé. \n\n');
            insertDataSql(mailIndex, attachmentIndex, whitForMail);
        } catch (err) {           
            return err;        
        }

    });

//  }; // fin de "function parseCsv"

//  }; // fin de "function parseXlsx"




        // ECRITURE D'UN FICHIER TEST correspondant aux données parsées : 
        // (on y note par exemple la suppression des espaces blancs en début de cellules)
    /*  
    
        for(let i = 0;  i < 68; i++)               // ligne 68 = fin de la feuille 1
        //  for(let i = 0; i < rows.length; i++)   // ligne originelle
        { 
        //  console.log('données sélectionnées');   
        //  console.log(csvData[i][15]);      
            
            writeStr += csvData[i].join("|") + ("\n");
    
            fs.writeFile(__dirname + '/Tableaux/csv_test/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv', writeStr, function(err)
            {                    
                if (err) throw err;
            });

        };      
        console.log('"461 - fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv" a été sauvegardé dans le répertoire secondaire. \n\n'); 

    */ 
    
  
        ////////////----------------------------------------------////////////
            ////////       CONNEXION A LA BASE DE DONNEE (MYSQL)      ////////
        ////////////----------------------------------------------////////////
        
        //---- variables de connexion à la bdd MySQL (car elle ne marche pas pour moi encore en Mariadb)
    
//        const mysql2 = require('mysql2');


//  let csvData = [];

    function insertDataSql(mailIndex, attachmentIndex, whitForMail) {

        //    console.log('test insertdatasql :'+ attachmentIndex, mailIndex, whitForMail);    
        
            //*-------------------------------------------------------------------*//
            
            //*               ECRITURE dans la table 'fishing'                  *//
            
            //*-------------------------------------------------------------------*//

            
    /* Begin transaction */
        connection.beginTransaction(function(err) {
            
            //---- TRAITEMENT DE LA CELLULE DATE POUR MYSQL :

            let datesvalues = [
            csvData[1][1],
            ];
            
            //---- on passe d'une date au format excel (nombre de jours après le 01-01-1900) >> date voulue au format GMT :
            let formatdates = new Date((datesvalues - (25567 + 2)) * 86400 * 1000); 
            
            //---- on passe la nouvelle date au format YYYY-MM-DD :
            let reformatdates = formatdates.getFullYear() +"-"+ (parseInt(formatdates.getMonth()) + 1) +"-"+ formatdates.getDate();   
            //  console.log(reformatdates);


        //*---------------------------------------------------------------------------*//
        
        //*    REQUETE D'INSERTION (MYSQL) des données dans la table 'fishing'      *//
        
        //*---------------------------------------------------------------------------*//
        
        //**** référence : https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp (entre autres)
        

            let sql = 'INSERT INTO fishing (id_specie, date, value_landing, value_quota) VALUES ?';

    //            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                
                //---- BOUCLE 'for' pour la sélection des données du tableau Javascript créé au parsage :
                for(let index = 1; index <= 17 ; index ++) {            
                    let landing_specie = csvData[index+7][13];           
                    
                    //---- Gestion de reconnaissance des cellules vides ('not defined') en Base de données :
                    
                    

                    if(landing_specie == "") {                
                        landing_specie = null;
                    };

    /*                    if (typeof landing_specie === 'undefined' || landing_specie === " " || landing_specie === null) { // AUTRE METHODE ?
                        // variable is undefined or null
                    }   */
                    
                    let quota_specie = csvData[index+7][15];

                    if(quota_specie == "") {
                        quota_specie = null;
                    };

                    let result = [index, reformatdates, landing_specie, quota_specie];
                    //    result.push();            
                    //    console.log(result);
                    
                    //----  insertion des résultats en BDD (méthode des transactions)                
                        
                    connection.query(sql, [[result]], function (err, result) {
                                //  if (err) throw err;
                        if (err) { 
                            connection.rollback(function() {
                                throw err;
                            });
                        };
                        connection.commit(function(err) {
                            if (err) { 
                                connection.rollback(function() {
                                throw err;
                                });
                            }
    //                           console.log('Transaction Complete.');
    //                           connection.end();
                        });       
                    });
                };   // fin de boucle 'for'

    //            }); // fin de transaction
        


            //---- REPETITION DE LA BOUCLE 'for' pour les autres lignes sélectionnées : 

    //        connection.beginTransaction(function(err) {
            if (err) { throw err; }

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

                    //----  insertion des résultats en BDD (méthode des transactions)                
                        
                connection.query(sql, [[result]], function (err, result) {
                        //  if (err) throw err;
                    if (err) { 
                        connection.rollback(function() {
                            throw err;
                        });
                    };
                    connection.commit(function(err) {
                        if (err) { 
                            connection.rollback(function() {
                            throw err;
                            });
                        }
    //                        console.log('Transaction Complete.');
    //                           connection.end();       
                    });
                });
            };   // fin de boucle 'for'

    //        }); // fin de transaction

        
    //        connection.beginTransaction(function(err) {
            if (err) { throw err; }


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
                
                connection.query(sql, [[result]], function (err, result) {
                    //  if (err) throw err;
                    if (err) { 
                        connection.rollback(function() {
                            throw err;
                        });
                    };
                    connection.commit(function(err) {
                        if (err) { 
                            connection.rollback(function() {
                            throw err;
                            });
                        }
    //                        console.log('Transaction Complete.');
    //                           connection.end();
                    });
                });
            };   // fin de boucle 'for'

    //        }); // fin de transaction

    //        connection.beginTransaction(function(err) {
            if (err) { throw err; }

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
                
                connection.query(sql, [[result]], function (err, result) {
                    //  if (err) throw err;
                    if (err) { 
                        connection.rollback(function() {
                            throw err;
                        });
                    };
                    connection.commit(function(err) {
                        if (err) { 
                            connection.rollback(function() {
                                throw err;
                            });
                        }
                        console.log('Transaction Complete.');
    //                        connection.end();
                    });     
                });
            };   // fin de boucle 'for'

        }); // fin de transaction


//        }); // fin de 'con.connect'


        connection.on('close', function(err) {

            if (err) {
                console.log('Oops! Unexpected closing of connection, lets reconnect back.'+ err);
                connection = mysql.createConnection(connection.config);
            } else {
                console.log('Connection closed normally.');
                console.log('662 - ############# données intégrées à la BDD ! \n\n');
//                connection.end();
            };

        });

    };//  fin de fonction insertDataSql();

}; // fin de "function parse.Csv"