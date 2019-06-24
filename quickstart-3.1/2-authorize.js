/*------------------------------------------------------------------------
    2 - Autorisation d'un client OAuth2 par son jeton d'authentification
-------------------------------------------------------------------------*/

// Modules de Quickstart-3.0 :
const getnewtoken = require('./3a-getnewtoken');

// Modules complémentaires NodeJs :
const googleAuth = require('google-auth-library');
const fs = require('fs');

/*------------------------------------------------------------------------
Si vous modifiez ces étendues, supprimez vos informations d'identification 
précédemment enregistrées sur ~/.credentials/gmail-nodejs-quickstart.json
-------------------------------------------------------------------------*/

let TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials-api/'; // répertoire (modifiable au besoin) où est automatiquement enregistré le jeton d'accès nécessaire pour accéder à l'API Gmail (chez moi : '/home/yanniscode_bzh/.credentials-api' sur 'Lubuntu' et 'D:\Users\isen-user\.credentials' sur Windows)
let TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

/**
* @param {Object} credentials Les informations d'identification du client d'autorisation.
* @param {function} callback  Le rappel à appeler avec le client autorisé : si le jeton d'authentification a été lu correctement, on autorise la lecture des mails (fonction 'listMails')
*/

module.exports = {


    authorize: function authorize(credentials, callback) {
    // console.log('paramètre "credentials" : ' + credentials);
    // console.log('paramètre "callback" : ' + callback);
    
    let clientId = credentials.installed.client_id;
    let clientSecret = credentials.installed.client_secret;
    let redirectUrl = credentials.installed.redirect_uris[0];
    
    let auth = new googleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl); // la variable d'authentification rappelée par les callbacks


    /*------------------------------------------------------------------------
                    Vérifiez si nous avons déjà stocké un jeton.
    -------------------------------------------------------------------------*/

        fs.readFile(TOKEN_PATH, function (err, token) {

            if (err) {
            console.log('2 - Allez récupérer un nouveau jeton d\'identification Gmail... \n');
            getnewtoken.getnewtoken(oauth2Client, callback);
            } else {
                console.log('2 - Jeton d\'identification Gmail actuel utilisé ! \n');
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
       
        });

    } // fin de fonction 'authorize'


}; // fin de 'module.exports'