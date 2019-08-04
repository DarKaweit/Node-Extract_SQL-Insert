/*------------------------------------------------------------------------
            4 - Récupération des mails correspondant à nos critères
-------------------------------------------------------------------------*/ 


// Modules de Quickstart-3.0 :
const mailcheck = require('./5-mailcheck');

// Modules complémentaires NodeJS :
const {google}   = require('googleapis');     // accolades ajoutées (nouveau type d'écriture)


/**
 * @param {google.auth.OAuth2} auth Un client OAuth2 autorisé.
*/
/**
 * @param {google.auth.OAuth2} userId Un client OAuth2 autorisé. // AJOUT
*/
/**
 * @param {google.auth.OAuth2} threadId Un client OAuth2 autorisé. AJOUT
*/
// *  @param  {String} id ID of Message with attachments. // id du message = PARAMÈTRE ENLEVÉ (PAS NÉCESSAIRE ICI ?? ON NE RECHERCHE PAS UN MESSAGE PAR SON ID)

    console.log(`\n -----------------------------------------------------------------------------\n\n                      EXTRACTION, PARSAGE, INSERTION `);


console.log('\n -----------------------------------------------------------------------------');
console.log(' \n ---');


module.exports = {

    
    listmails : function listMails(auth, userId, threadId, id) {

        console.log('4 - paramètre "auth" : '+ auth +'\n\n');
        
        let gmail = google.gmail('v1');
    //    let fichierPj = 'whitform';
    //    console.log(gmail);

        gmail.users.threads.list({ // MODIFICATION : RÉCUPÉRATION DU MAIL PAR LA THREAD_ID PLUTÔT QUE L'ID DU MAIL (PROBLEME DES DOUBLONS)
        // gmail.users.messages.list({
            'auth' : auth, // Utilise l'authentification Oauth 
            'userId' : 'me',
            'id': id, // id du message = PARAMÈTRE ENLEVÉ (PAS NÉCESSAIRE ICI ?? ON NE RECHERCHE PAS UN MESSAGE PAR SON ID)
            "criteria": {
            //     "from": '',
            //     "to": 'quotauk@gmail.com',
            //     "subject": 'WHITEFISH REPORT',
            //     "query": string,
            //     "negatedQuery": string,
            //     "hasAttachment": 'false',
            //     "excludeChats": boolean,
            //     "size": integer,
            //     "sizeComparison": string
            },
        },
        {
            qs: { //    la propriété 'qs' prend en compte de multiples requêtes (seul moyen actuel pour que la récupération des données se fasse...)
                'q' : 'subject:WHITEFISH REPORT -{AMENDED FINAL}', // tous les messages 'whitefish report' ne contenant pas 'amend' et 'final'
            //     // 'q' : fichierPj
            //     // 'q' : 'from:xyz.abc@gmail.com' // rechercher les messages provenant de mon adresse mail
            //     // 'q' : fichierPj +' is:read'*/ // recherche les messages lus / non lus (option = read / unread)
            }
        },
        function(err, results) {

            if (err) { 
                throw err + '4 - Erreur de connexion à Gmail (Veuillez vérifier votre connexion à Internet)'
            };

            // console.log('paramètre results : '+ results);
            // console.log(gmail.users.threads);
            // console.log(gmail.users.messages);
            // console.log(fichierPj);

            console.log('4  ------------------------------------------------------------------------------------\n   ----------- SELECTION DES MAILS CONTENANT UNE OU PLUSIEURS PIECES JOINTES  "fichier-sakana-whitform"--------------------------------------------------------------------------');
            console.log('\n\n [1] 4 -- Sélection d\'un mail contenant "whitform.xlsx". -- \n\n');

            for(let mailIndex = 0; mailIndex < results.threads.length; mailIndex++) { 
                // Modifier ici au besoin le nombre de mails que l'on veut récupérer ( de '0 <= mailIndex' à mailIndex < 'results.messages.length')

                try {
                    let whitFormHistoryId = results.threads[mailIndex].historyId;
                    console.log('4 - historyId : ' + whitFormHistoryId);

                    let whitForMail = results.threads[mailIndex].id;
                    console.log('4 - whitForMail :' + whitForMail);
                    console.log('4 - Nombre total de mails correspondants répertoriés dans votre boîte : ' + results.threads.length);
                    console.log('\n\n\ 4 -> Un mail contenant une ou plusieurs pièces jointes "whitform.xlsx" à été trouvé. Identifiant du mail : '+ whitForMail +'\n');
                    console.log('4 - index du mail : '+ mailIndex +'\n');
                    //    console.log(results.messages[mailIndex].id + '\n\n'); 
                    //    console.log(auth, whitForMail, mailIndex +'\n\n');                
                    //    console.log('227 - recupIdAttachment (id du mail) : ' + auth, whitForMail, mailIndex +'\n\n');

                    mailcheck.mailcheck(auth, whitForMail, mailIndex, whitFormHistoryId);                            
                } catch(err) {
                    console.log('\n 4 -> erreur (connexion ?)\n');
                    return err;
                }
                        
            };
            
        });

    } // fin de fonction listMails


}; // fin de 'module.exports'