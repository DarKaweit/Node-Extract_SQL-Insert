/*------------------------------------------------------------------------
                7 - Récupération de l'id de la pièce jointe.
-------------------------------------------------------------------------*/


// Modules de Quickstart-3.0 :
const xlsxdownload = require('./7-xlsxdownload');

// Modules complémentaires NodeJS :
const {google}   = require('googleapis');     // accolades ajoutées (nouveau type d'écriture)

//---- VARIABLE POUR AJOUTER LA DATE DU JOUR (au format DD-MM-YYYY) au nom de fichiers enregistré :

let d = new Date();
let today = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
// console.log('date du jour : ' + today);


module.exports = {


    /** @param  {String} userId User's email address. The special value 'me'
     *  can be used to indicate the authenticated user.
     *  @param  {String} id ID of Message with attachments.
     *  @param  {String} messageId ID of Message with attachments.
    */


    recupidattachment: function recupIdAttachment(auth, id, mailIndex, whitForMail, whitFormHistoryId) {
        // le paramètre 'whitForMail' devient 'id'
        //  console.log('paramètre id mail : '+ id),

        // console.log('388 - check### whitForMail + mailIndex : '+ auth, id, mailIndex, whitForMail +'\n\n')

        console.log(' \n ---');
        console.log('\n\n [2] 6 -- Recherche des IDs de pièces jointes "fichier-sakana-whitform"... ------------------------------------------');
        console.log(' \n ---');

        let gmail = google.gmail('v1');

        gmail.users.messages.get({ // Accèdes aux informations
        'auth' : auth, // Utilise l'authentification Oauth 
        'userId' : 'me', // Charge le fichier secret.
        'id' : id,
        },
        function (err, results) {

            //   console.log('show attachment "results": '+ results);
            //console.log('404 -'+ whitForMail +'\n'+ err);

            if (err) {
            console.log('\n 6 - Echec de votre connexion au(x) mail(s). Vérifiez les paramètres de connexion sur "quickstart.js". ' + err + '\n');
            return;
            }
            console.log('\n 6 -------- Connexion réussie à un mail : \n\n');

            for (let attachmentIndex = 1; attachmentIndex < 2; attachmentIndex++) { // MODIF : NE PRENDRE EN COMPTE QU'UNE SEULE PIECE-JOINTE (ATTACHMENT) EN CAS DE DOUBLON DANS UN MAIL (EX : le 16/05/2018) - attention : index attachmentIndex = 1 au départ (semble obligatoire ici...)
            // for (let attachmentIndex = 1; attachmentIndex < results.payload.parts.length; attachmentIndex++) {

                try {
                    let pj = results.payload.parts[attachmentIndex].body.attachmentId;
                    console.log(' 6 - nombre de pièces jointes (+ 1) : ' + results.payload.parts.length +'\n\n');
                    console.log('6 - id de la pièce-jointe : \n\n' + pj +'\n\n');
                    console.log('\n 6 -> Pièce jointe "fichier-sakana-whitform-'+ whitFormHistoryId +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx" identifiée sous le numéro de  "pj" : \n\n'+ pj +'\n\n 279 - index pièce jointe : '+ attachmentIndex +'\n\n');
                    console.log('\n 6 -> Pièce jointe "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx" identifiée sous le numéro de  "pj" : \n\n'+ pj +'\n\n 279 - index pièce jointe : '+ attachmentIndex +'\n\n');
                    // console.log('PJ : '+ auth, id, mailIndex, pj, attachmentIndex +'\n');

                    xlsxdownload.xlsxdownload(auth, pj, mailIndex, attachmentIndex, whitForMail, whitFormHistoryId); // recupData   // Appelle la fonction "recupData"
                } catch (err) {
                    //    console.log('425 - xlsxDownload : ' + auth, id, mailIndex, attachmentIndex + '\n\n');
                    console.log('\n 6 - Pièce jointe "fichier-sakana-whitform" non reconnue. \n');
                    return '\n 6 - Pièce jointe "fichier-sakana-whitform" non reconnue. \n' + err;
                };
  
            };
        
        });

    }  // fin de fonction recupIdAttachment


}; // fin de 'module.exports'