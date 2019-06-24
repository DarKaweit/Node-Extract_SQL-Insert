/*------------------------------------------------------------------------
            9 - Module de conversion 'node-xlsx' (du format '.xlsx' au '.csv')
-------------------------------------------------------------------------*/

// inspiration pour le module : https://stackoverflow.com/questions/34342425/convert-xls-to-csv-on-the-server-in-node



// Modules de Quickstart-3.0 :
const parsecsv = require('./9-parsecsv');

// Modules complémentaires NodeJS :
const fs = require('fs');
const xlsx = require('node-xlsx');

// let csvData = []; (ATTENTION : Placé ici, ne récupère qu'un seul fichier '.xlsx')

let d = new Date();
let today = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
// console.log('date du jour : ' + today);



module.exports = {


    parsexlsx: function parseXlsx(auth, id, mailIndex, attachmentIndex, whitForMail, whitFormHistoryId) {


        //    console.log('test parseXlsx'+ auth, id, '\n'+ mailIndex, attachmentIndex, whitForMail +'\n\n');

        console.log('\n\n 8 - Analyse et parsage du tableau. -- \n');
        console.log(' \n -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- \n\n');

        const obj = xlsx.parse(__dirname + '/../Tableaux/xlsx/fichier-sakana-whitform-'+ whitFormHistoryId +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx'); // Parser un fichier EXCEL --> référence de la pièce-jointe indiquée ici.

        // const obj = xlsx.parse(__dirname + '/../Tableaux/xlsx/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.xlsx'); // Parser un fichier EXCEL --> référence de la pièce-jointe indiquée ici.
        
        let rows = [];
        let writeStr = "";
        
        // Faire une boucle traversant les feuilles '.xlsx' (obj[i] = 1 feuille '.xlsx') à parser
        // La variable 'sheet' contient donc toutes les lignes d'un tableau '.xlsx' :

        for(let i = 0; i < obj.length; i++) {

            let sheet = obj[i];
        
            //---- faire une autre boucle ('j' = 1 colonne) traversant toutes les lignes (ou sheet['data']) du fichier .xlsx
  
            for(let j = 0; j < sheet['data'].length; j++) {
                //---- ajouter les données sélectionnées ('sheet[data][j]') au fichier '.csv'        
                rows.push(sheet['data'][j]);
            };

        }; // A DEPLACER APRES BOUCLE ECRITURE CSV ??
        
        
        //---- ECRITURE du fichier XLSX dans un fichier (temporaire ?) '.csv': 
        
        //---- les champs sont séparés par des "|", et les retours à la ligne indiqués par "\n"
        
        //****** QUESTION EN SUSPEND : on décidera peut-être d'envoyer le CSV dans une réponse au lieu d'un fichier, sans passer par l'étape fichier temporaire ???
        
     
        for(let i = 0;  i < 68; i++) { // On s'arrêtera dans un premier temps à la ligne 68 (= fin de la feuille 1), sinon : remplacer i par 'row.length'

// ****************************************************
        
        //---- ligne originelle (utilisable si l'on veut lire tout le tableau d'un coup) :
    
        // for(let i = 0; i < rows.length; i++)

// ****************************************************
            try {
                writeStr += rows[i].join("|") + ("\n");
                fs.writeFile(__dirname + '/../Tableaux/csv/fichier-sakana-whitform-'+ whitFormHistoryId + '-'+ mailIndex +'__'+ attachmentIndex +'.csv', writeStr, function(err) {                
                // fs.writeFile(__dirname + '/../Tableaux/csv/fichier-sakana-whitform-'+ today + '-'+ mailIndex +'__'+ attachmentIndex +'.csv', writeStr, function(err) {
                    if (err) throw err;        
                //    console.log(err); 
                });
            } catch (err) {
                console.log('8 - erreur de parsage CSV : \n')
                throw err;
            }

        };

        console.log('"8 - fichier-sakana-whitform-'+ whitFormHistoryId +'-'+ mailIndex +'__'+ attachmentIndex +'.csv" a été sauvegardé dans le répertoire courant \n\n');
        // console.log('"8 - fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv" a été sauvegardé dans le répertoire courant \n\n');

        parsecsv.parsecsv(mailIndex, attachmentIndex, whitForMail, whitFormHistoryId) // ici ?

    }, // fin de fonction parseXlsx //


}; // fin de 'module.exports'
