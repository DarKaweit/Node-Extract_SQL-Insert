/*--------------------------------------------------------------------------------------
            8 - Téléchargement des pièces jointes (.xlsx) / récupération des données :
--------------------------------------------------------------------------------------*/


// Modules de Quickstart-3.0 :
const parsexlsx = require('./8-parsexlsx');

// Modules complémentaires NodeJS :
const {google} = require('googleapis');
const fs = require('fs');

let d = new Date();
let today = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
// console.log('date du jour : ' + today);


module.exports = {


    xlsxdownload: function xlsxDownload(auth, id, mailIndex, attachmentIndex, whitForMail, whitFormHistoryId) {
    //  console.log('443 - test 2 - PJ !!! '+ auth, id, mailIndex, attachmentIndex, whitForMail);

        console.log('\n\n\n\n 7 - Récupération des données d\'une pièce jointe "fichier-sakana-whitform.xlsx". -------------------- \n\n');

        let gmail = google.gmail('v1');

        gmail.users.messages.attachments.get({
            'auth': auth,
            'id': id,
            'messageId': id,
            'userId': 'me'
        },                
        function (err, results) {
    
            if (err) {
                console.log('\n\n    ----------<<< 7 - Aucun fichier à récupérer.\n'); // + err (pas utile ??)
            } else {
                // console.log('\n\n    ---------->>> 462 - fichier(s) "fichier-sakana-whitform.xlsx" trouvé(s) :  \n');
                console.log('7 - le fichier "sakana-whitform-'+ whitFormHistoryId +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx" va a présent être téléchargé à cette adresse :\n');
                // console.log(__dirname +'/../Tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx \n\n-----------------------------------------------------------------')  
                // console.log(__dirname +'/../Tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx \n\n-----------------------------------------------------------------')  

                fs.writeFile(__dirname +'/../Tableaux/xlsx/fichier-sakana-whitform-'+ whitFormHistoryId +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx', results.data, 'base64', function (err, results) {
                // fs.writeFile(__dirname +'/../Tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx', results.data, 'base64', function (err, results) {
                // console.log('317 - attachment infos + '+ auth, id, mailIndex, attachmentIndex, whitForMail +'\n');
                // console.log(data);
                    if (err) { throw err }; // AJOUT
                    console.log(results);

                    try {
                        console.log('\n    7 -> Téléchargement de pièce jointe... Enregistrées sous : "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx" dans le dossier "./Tableaux/xlsx". \n\n');                
                        // console.log('test xlsxDownload !!!' + auth, id, mailIndex, attachmentIndex, whitForMail + "\n\n");

                    } catch (err) {
                        console.log('\n 7 - Le téléchargement à échoué. Vérifiez les paramètres.\n' + err);
                    };

                    parsexlsx.parsexlsx(auth, id, mailIndex, attachmentIndex, whitForMail, whitFormHistoryId);


                });            

            };

        }
        );

    } // fin de fonction xlsxDownload


}; // fin de 'module.exports'
