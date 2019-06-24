/*---------------------------------------------------------------------------------------
    3a - Récupérer et enregistrer un nouveau jeton après avoir demandé l'autorisation
    de l'utilisateur, puis tenter de nouveau l'authentification par 'callback', 
    ou rappel du client OAuth2 autorisé.
---------------------------------------------------------------------------------------*/


// Modules de Quickstart-3.0 :
const storetoken = require('./3b-storetoken');

// Modules complémentaires NodeJs :
const readline = require('readline');


let SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

/**
* @param {google.auth.OAuth2} oauth2Client Le client OAuth2 pour obtenir un jeton.
* @param {getEventsCallback} callback Le rappel à appeler avec le client autorisé
*/


module.exports = {


    getnewtoken: function getNewToken(oauth2Client, callback) {

        // console.log('paramètre "oauth2Client" : '+ oauth2Client); // invisible
        // console.log('paramètre "callback" : '+ callback); // invisible
            
        let authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('3a - Autoriser cette application en visitant cette url: \n', authUrl + '\n');
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('3a - Entrez le code de cette page ici: \n', function (code) {
            rl.close();
            oauth2Client.getToken(code, function (err, token) {
                if (err) {
                    console.log('3a - Erreur lors de la tentative de récupération du jeton d\'accès... \n', err);
                    return;
                } else {
                    console.log('\n 3a - jeton d\'accès récupéré ! \n');
                    oauth2Client.credentials = token;
                    storetoken.storetoken(token);
                    callback(oauth2Client);
                };
            });        
        });

    } // fin de fonction 'getNewToken'


}; // fin de 'module.exports'