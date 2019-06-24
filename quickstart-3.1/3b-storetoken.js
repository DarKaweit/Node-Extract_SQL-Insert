/*------------------------------------------------------------------------------------------------------------------
    3b - Stocker le jeton sur le disque afin qu'il puisse être utilisé pour les exécutions ultérieures du programme.
------------------------------------------------------------------------------------------------------------------*/


// Modules complémentaires NodeJs :
const fs = require('fs');


/**
 * @param {Object} token Le jeton à stocker sur le disque.
*/

let TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials-api/'; // répertoire (modifiable au besoin) où est automatiquement enregistré le jeton d'accès nécessaire pour accéder à l'API Gmail (chez moi : '/home/yanniscode_bzh/.credentials-api' sur 'Lubuntu' et 'D:\Users\isen-user\.credentials' sur Windows)
let TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';


module.exports = {

    
    storetoken: function storeToken(token) {

        // console.log('paramètre "token" ######## : ' + token);

        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {                 // err = variable existante ???
            if (err.code != 'EEXIST') {
                throw err;
            }
        }

        fs.writeFile(TOKEN_PATH, JSON.stringify(token)); // écriture du fichier 'gmail-nodejs-quickstart.json' contenant le jeton d'authentification
        console.log('3b - Jeton stocké sur ' + TOKEN_PATH + '\n');

    }


}; // fin de 'module.exports'