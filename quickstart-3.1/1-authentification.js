/*------------------------------------------------------------------------//
//                                                                        //
//                          MODULE QUICKSTART 3.1:                        //
//                                                                        //
//------------------------------------------------------------------------*/


// DERNIERES MODIFICATIONS : (22/07/2019)

// ~~~~~~ Modification du parsage pour l'adapter à la Base de Données révisée et permettre l'ajout de coordonnées géographiques


// *************** EN COURS : *********************************************************************************************

// ~~~~~~ Relecture du code globale (gestion d'erreur)

// ***************A FAIRE : *********************************************************************************************

// ~~~~~~ Ajouter la date d'origine du mail au nom de fichier 'whitform.xlsx' sauvegardé, ou bien dans la BDD - tables 'id_mails' ?? (pour comparer date du jour d'envoi et celle de réception par Gmail)
// ~~~~~~ Fonctionnement avec MariaDB



/*------------------------------------------------------------------------//
//                                                                        //
//               MODULE DE TÉLÉCHARGEMENT DE LA PIÈCE JOINTE              //
//                                                                        //
//------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------
    1 - Charger les identifiants secrets du client à partir d'un fichier local.
---------------------------------------------------------------------------------*/

// Modules de Quickstart-3.1 :
const listmails = require('./4-listmails');
const authorize = require('./2-authorize');


// Modules complémentaires NodeJs :
const fs = require('fs');

       
// fs.readFile('./quickstart-3.1/client_secret/client_secret.json', function processClientSecrets(err, content) { // ATTENTION ! chemin relatif à 'cron_lancher-1.2.js'

fs.readFile('./client_secret/client_secret.json', function processClientSecrets(err, content) { // ATTENTION ! chemin relatif à 'cron_launcher.js'

    if (err) {
        console.log('1 - Erreur du chargement du fichier "client secret": \n');
        throw err;
    }

    /*------------------------------------------------------------------------
        Autorisez un client avec les informations d'identification chargées, 
        puis appelez la fonction listMails du fichier '4-listmails'
    -------------------------------------------------------------------------*/

    console.log('1 - Chargement du fichier "client secret" (API Gmail). -------------------------------------------------------------------');

    authorize.authorize(JSON.parse(content), listmails.listmails);

});
