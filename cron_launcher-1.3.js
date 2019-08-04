/*------------------------------------------------------------------------//
//                                                                        //
//        MODULE CRON_LAUNCHER-1.3 (ancien QUICKSTART_LAUNCHER-1.0)       //
//                                                                        //
//------------------------------------------------------------------------*/

// référence :https://github.com/wahengchang/nodejs-cron-job-must-know

// Module de planification de tâche (crontab) pour Node.js, et dans notre cas : QUICKSTART-3.0.js
// CRON_LAUNCHER-1.3 (ancien QUICKSTART_LAUNCHER-1.2) : Module de planification de tâche (crontab) pour Node.js, et dans notre cas : QUICKSTART-3.1.js
// DERNIERES MODIFICATIONS : (23/06/2019)


// Modules NodeJS utilisés :
let cron = require('node-cron'); // Module de planification de tâche (crontab)

let mysql2 = require('mysql2');

const connection = mysql2.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_sakana"
});


//  Ordre des unités temporelles : 
//  seconde / minute / heure / numéro du mois / jour du mois / jour de la semaine (de 1 à 7)
//    cron.schedule('0 0 15 * * 2-5', function() { // version dont les dates pourrait convenir à notre projet : déclencher le script du Mardi au Vendredi, à 15 h 00 min 00 s


//    cron.schedule('50 22 17 6 6 6', function() { // test à un instant précis

cron.schedule('15 * * * * *', function() { // test à chaque minute (à la seconde 15)

    let shell = require('./child_helper/child_helper'); // fichier "child_helper" nécessaire

//    var command = "node quickstart-2.2.js";

    let commandList = [ // liste de commandes, si l'on veut lancer plusieurs scripts en même temps
        // "node ../quickstart-3.0/1-authentification.js"
        "node ./quickstart-3.1/1-authentification.js"
        // "node quickstart-2.2.js" // commande de lancement de quickstart.js
    ];


    connection.beginTransaction(function(err, result) {

        let sql = ('INSERT INTO cron_infos (id_cron) VALUE (NULL)');
        // MARCHE PAS comme ça :
        // let sql = ('INSERT INTO cron_infos (id_cron) VALUE (NULL); INSERT INTO mail_infos (id_cron) VALUE ("SELECT LAST_INSERT_ID() FROM cron_infos LIMIT 1")'); // insérer un numéro d'identifiant ('cron_number') à chaque transaction (+ un timestamp auto-généré)

        connection.query(sql, function (err, result) { // début de connexion à la Base de Données MySQL

            if (err) { 
                connection.rollback(function() {
                    throw err;
                });
            };

            connection.commit(function(err, result) { // permet l'insertion du 'cron_number'

                if (err) { 
                    connection.rollback(function() {
                        throw err;
                    });
                };


                shell.series(commandList , function(err, result) {  // résultat de la commandes groupée (après avoir lancé plusieurs scripts en même temps)

                    if (err) { 
                        connection.rollback(function() {
                            console.log('Erreur de transaction.\n');       console.log(err);      
                            // throw err;
                        });
                    } else {
                        console.log('Transaction effectuée.\n');
                        console.log(result);
                        //    console.log('executed many commands in a row');
                    
                        connection.end();
                    };
                }); // fin de connexion à MySQL
            

                connection.on('close', function(err, result) { 

                    if (err) {
                        console.log('Coupure inattendue de la connexion. Lancement d\'une nouvelle tentative...\n');
                        console.log(err);
                        connection = mysql.createConnection(connection.config);
                    } else {
                        console.log('La connexion s\'est fermée normalement.\n');
                        connection.end();
                    };

                }); // fin de 'connection.on'
    
            }); // fin de 'connection.commit'
    
        }); // fin de 'connection.query'

    }); // fin de 'connection.beginTransaction'

}); // fin de 'cron.schedule'