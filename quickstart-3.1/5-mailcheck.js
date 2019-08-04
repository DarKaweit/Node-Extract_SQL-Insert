/*---------------------------------------------------------------------------
            5 - Vérification des mails (s'ils existent déjà en Base de Données, 
            on ne les prend pas.)
--------------------------------------------------------------------------- */


// Modules de Quickstart-3.0 :

const recupidattachment = require('./6-recupidattachment');

// const mailidinsert = require('./6-mailidinsert'); // à l'origine : l'insertion des mails était après ce fichier (avant le parsage et l'insertion des données en BDD !)

// Modules complémentaires NodeJS :
const mysql2 = require('mysql2'); // semble mieux marcher que Mysql

const connection = mysql2.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_sakana"
});

const debug = true; // gestion d'erreur


module.exports = {


    mailcheck: function mailCheck(auth, whitForMail, mailIndex, whitFormHistoryId) {
        //    console.log('mailCheck :'+ auth, whitForMail, mailIndex, whitForMail);

        // if(debug) {
        //     console.log("DEBUG WHITMAIL");
        //     console.log(whitForMail);
        // }

        // connection.query('SELECT * FROM id_mails WHERE mail_date = ?', whitFormHistoryId, function (err, results) {
        let mailCheck = connection.query('SELECT mail_number FROM mail_infos WHERE mail_number = ?', whitForMail, function (err, results) {

            console.log('5-40 - mailCheck values: ')
            console.log (mailCheck.values);

            console.log ('5-36 ' + results.values);

            if(results.length > 0) {
                console.log("5-46 - la donnée est déjà présente !");
                // throw err;
            } else {
                console.log('#########################');
                // console.log('50 - le résultat : ')
                // console.log (results);

                recupidattachment.recupidattachment(auth, whitForMail, mailIndex, whitForMail, whitFormHistoryId);    
                // mailidinsert.mailidinsert(auth, whitForMail, mailIndex, whitFormHistoryId);
            }

        });
                
    } // fin de fonction mailCheck


}; // fin de 'module.exports'