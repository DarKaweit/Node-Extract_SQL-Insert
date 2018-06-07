// QUICKSTART_LAUNCHER-1.0  : Module de planification de tâche (crontab) pour Node.js, et dans notre cas : QUICKSTART-2.1.js
// DERNIERES MODIFICATIONS : (06/06/2018)
// référence :https://github.com/wahengchang/nodejs-cron-job-must-know

let cron = require('node-cron'); // Module de planification de tâche (crontab)
let mysql2 = require('mysql2');

const connection = mysql2.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_sakana"
});


//    cron.schedule('0 0 15 * * 4-5', function() { // version dont les dates pourrait convenir à notre projet : déclencher le script du Mardi au Vendredi, à 15 h 00 min 00 s


//    cron.schedule('50 22 17 6 6 6', function() { // test à un instant précis

cron.schedule('15 * * * * *', function() { // test à chaque minute (à la seconde 15)

    let shell = require('./child_helper'); // fichier "child_helper" nécessaire

//    var command = "node quickstart-2.1.js";

    let commandList = [ // liste de commandes, si l'on veut lancer plusieurs scripts en même temps
        "node quickstart-2.1.js" // commande de lancement de quickstart.js
    ];


    connection.beginTransaction(function(err, result) {

        let sql = ('INSERT INTO cron_infos (id_cron) VALUE (NULL)'); // insérer un numéro d'identifiant ('cron_number') à chaque transaction (+ un timestamp auto-généré)

        connection.query(sql, function (err, result) { // début de connexion à la Base de Données MySQL

           connection.commit(function(err, result) { // permet l'insertion du 'cron_number'

                if (err) { 
                    connection.rollback(function() {
                        throw err;
                    });
                };


                shell.series(commandList , function(err, result) {  // résultat de la commandes groupée (après avoir lancé plusieurs scripts en même temps)   
                    console.log('Transaction effectuée.');
                    //    console.log('executed many commands in a row');
//                    connection.end();
                }); 
            
            }); 

        }); // fin de connexion à MySQL


        connection.on('close', function(err, result) { 

            if (err) {
                console.log('Coupure inattendue de la connexion.'+ err);
                connection = mysql.createConnection(connection.config);
            } else {
                console.log('La connexion s\'est fermée normalement.');
                connection.end();
            };

        }); 
    
    
    }); // fin de transaction

});
