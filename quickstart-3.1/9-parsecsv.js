/*------------------------------------------------------------------------
                        10 - Module de parsage (csv-parse) :
-------------------------------------------------------------------------*/

//---- voir : https://github.com/adaltas/node-csv-parse/issues/166


// Modules de Quickstart-3.1 :
const mailidinsert = require('./10-mailidinsert');

// const insertdatasql = require('./10-insertdatasql'); (à l'origine, tentative de fichiers séparés pour l'insertion de données CSV)


//---- Déclaration des modules NodeJS complémentaires :
const parse = require('csv-parse');
const fs = require('fs');


const mysql2 = require('mysql2');

const connection = mysql2.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_sakana"
});

// *****************

// TEST POOL DE CONNEXION : (PERMET DES CONNEXIONS SIMULTANÉES)

// var pool  = mysql2.createPool({
//   connectionLimit : 1,
//   host            : 'localhost',
//   user            : 'root',
//   password        : '',
//   database        : 'test_sakana'
// });

// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// *****************

//---- Déclaration de variables supplémentaires :
let d = new Date();
let today = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
// console.log('date du jour : ' + today);



module.exports = {


    parsecsv: function parseCsv(mailIndex, attachmentIndex, whitForMail, whitFormHistoryId) {

        //  console.log('test parseCsv ' + attachmentIndex, mailIndex, whitForMail +'\n\n'); // donne les données du tableau 'csvData'
        
        let csvData = [];    // ATTENTION ! Variable placée ici, car si au dessus de la fonction 'parseCsv', un seul tableau est pris en compte
            
        //    console.log('test csvData ' + csvData +'\n\n'); // affiche les données du tableau 'csvData'
        
        
        //---- Options de parsage :
        
        const config = {
            parserOptions: 
            {
                delimiter: '|', // délimiteur de champs
                trim: true,     // option permettant de supprimer les blancs en début et fin de cellules
                relax_column_count: true // ignore les colonnes inconsistantes
            }
        };
        
        //---- LECTURE du fichier parsé ('.csv') :

        fs.createReadStream(__dirname + '/../Tableaux/csv/fichier-sakana-whitform-'+ whitFormHistoryId +'-'+ mailIndex +'__'+ attachmentIndex +'.csv')
        // fs.createReadStream(__dirname + '/../Tableaux/csv/fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv')

        //----Prise en compte des options déclarées :
     
        .pipe(parse(config.parserOptions))

        //---- Prise en compte des données parsées et conversion en données de tableau Javascript :
      
        .on('data', function (csvrow) {    
        //     if (err) { throw 'erreur de parsage en CSV : ' + err }; // AJOUT
            // ou :

            try {
                csvData.push(csvrow);
                //  console.log('ligne parsée');
            } catch (err) {
                console.log('9 - erreur de parsage en CSV :\n');
                throw err;
            }
            
        })

            
        //**** écritures des données parsées à partir du fichier '.csv' (converties en tableau lisible par MySQL)
        
        .on('end', function writeCsv () { // modifié : function(err)
        
            try {
                //  console.log('affichage des donnees parsées :');
                console.log('9 - "fichier-sakana-whitform-'+ whitFormHistoryId +'-'+ mailIndex +'__'+ attachmentIndex +'.csv" a été parsé. \n\n');
                // console.log('9 - "fichier-sakana-whitform-'+ today +'-'+ mailIndex +'__'+ attachmentIndex +'.csv" a été parsé. \n\n');

                insertdatasql();
                // insertdatasql(mailIndex, attachmentIndex, whitForMail, whitFormHistoryId);
            } catch (err) {           
                console.log('9 - erreur d\'écriture du fichier CSV :\n');
                throw err;        
            }

        });

        let insertdatasql = function insertDataSql() {
        // let insertdatasql = function insertDataSql(mailIndex, attachmentIndex, whitForMail, whitFormHistoryId) {

            //    console.log('test insertdatasql :'+ attachmentIndex, mailIndex, whitForMail);    
                


//        pool.getConnection(function(err, connection) {
//            if (err) throw err; // not connected!

            /* Begin transaction */

            connection.beginTransaction(function(err) {

                //**** référence : https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp (entre autres)

                if (err) { 
                    console.log('9 - Erreur de connexion.\n');
                    throw  err 
                };

                console.log("9 - Connected!");
            

                //---- TRAITEMENT DE LA CELLULE DATE POUR MYSQL :

                let datesvalues = [
                    csvData[1][1],
                ];
            
                if (datesvalues == "") {                
                    datesvalues = null;
                };

                //---- On passe d'une date au format '.xlsx' (ex: 43453 = le nombre de jours passées depuis le '01-01-1900') à la date voulue au format GMT :
                let formatdates = new Date((datesvalues - (25567 + 2)) * 86400 * 1000); 
                
                //---- on passe la nouvelle date au format YYYY-MM-DD :
                let reformatdates = formatdates.getFullYear() +"-"+ (parseInt(formatdates.getMonth()) + 1) +"-"+ formatdates.getDate();   
                //  console.log(reformatdates);


                let sql = 'INSERT INTO fishing (id_specie, date, value_landing, value_quota) VALUES ?';
                    



// *************************************************************************************************

                //---- BOUCLE 'for' pour la sélection des données du tableau Javascript créé au parsage :
                for (let i = 1; i <= 17 ; i ++) {


                    let landing_specie = csvData[i + 7][13];           
                        
                    //---- Gestion de reconnaissance des cellules vides ('not defined') en Base de données :

                    if (landing_specie == "") {                
                        landing_specie = null;
                    };

                    /* if (typeof landing_specie === 'undefined' || landing_specie === " " || landing_specie === null) { // AUTRE METHODE ?
                        // variable is undefined or null
                    } */
                        
                    let quota_specie = csvData[i + 7][15];

                    if (quota_specie == "") {
                        quota_specie = null;
                    };

                    let result = [
                        [i, reformatdates, landing_specie, quota_specie]
                    ];
                    //    result.push();
                    //    console.log(result);
                

                    //----  insertion des résultats en BDD (méthode des transactions)  
                            
                    if (err) { 
                        console.log('9 - Erreur de connexion.\n');
                        throw  err;
                    };

                    connection.query(sql, [result], function (err, result) {

                        if (err) {
                            connection.rollback(function() {
                                console.log('9 - Erreur #### ' + result + '\n')
                                throw err;
                            });
                        };


                        // connection.commit(function(err) {
                        //     if (err) { 
                        //         connection.rollback(function() {
                        //         throw err;
                        //         });
                        //     };
                        //         console.log('Transaction Complete.\n');
                        //     //     connection.end();
                        // });

                    });


                };   // fin de boucle 'for'        


// *************************************************************************************************

                //---- REPETITION DE LA BOUCLE 'for' pour les autres lignes sélectionnées : 

                if (err) { 
                    console.log('9 - Erreur de connexion.\n');
                    throw  err 
                };

                for(let i = 18; i <= 32 ; i ++) {

            
                    let landing_specie = csvData[i + 9][13];           
                    
                    if (landing_specie == "") {                
                        landing_specie = null;
                    };
                    
                    let quota_specie = csvData[i + 9][15];

                    if (quota_specie == "") {
                        quota_specie = null;
                    };
                    
                    let result = [
                        [i, reformatdates, landing_specie, quota_specie]
                    ];

                    //    result.push();
                    //    console.log(result);

                    //----  insertion des résultats en BDD (méthode des transactions)                
                            
                    connection.query(sql, [result], function (err, result) {

                        if (err) { 
                            connection.rollback(function() {
                                throw err;
                            });
                        };
                        // connection.commit(function(err) {
                        //     if (err) { 
                        //         connection.rollback(function() {
                        //         throw err;
                        //         });
                        //     }
                        //      console.log('Transaction Complete.\n');
                        //     // connection.end();       
                        // });


                    });


                };   // fin de boucle 'for'


// ***************************************************************************************************

            
                if (err) { 
                    console.log('9 - Erreur de connexion.\n');
                    throw  err 
                };
                
                for (let i = 33; i <= 39 ; i ++) {
                
                    let landing_specie = csvData[i + 11][13];         
                    
                    if (landing_specie == "") {                
                        landing_specie = null;
                    };
                
                    let quota_specie = csvData[i + 11][15];

                    if (quota_specie == "") {
                        quota_specie = null;
                    };

                    let result = [
                        [i, reformatdates, landing_specie, quota_specie]
                    ];

                    // result.push();
                    // console.log(result);
                    
                    connection.query(sql, [result], function (err, result) {

                        if (err) { 
                            connection.rollback(function() {
                                throw err;
                            });
                        };

                        // connection.commit(function(err) {
                        //     if (err) { 
                        //         connection.rollback(function() {
                        //         throw err;
                        //         });
                        //     }
                        //     console.log('Transaction Complete.\n');
                        //     // connection.end();
                        // });


                    });

                };   // fin de boucle 'for'



// *****************************************************************************************************


                if (err) { 
                    console.log('9 - Erreur de connexion.\n');
                    throw  err 
                };


                for (let i = 40; i <= 43; i ++) {


                    let landing_specie = csvData[i + 24][13];

                    if(landing_specie == "") {                
                        landing_specie = null;
                    };
                
                    let quota_specie = csvData[i + 24][15];

                    if(quota_specie == "") {
                        quota_specie = null;
                    };      
                    
                    let result = [
                        [i, reformatdates, landing_specie, quota_specie]
                    ];

                    //    result.push();
                    //    console.log(result);
                    
                    connection.query(sql, [result], function (err, result) {

                        if (err) { 
                            connection.rollback(function() {
                                throw err;
                            });
                        };

                        connection.commit(function(err) {
                            if (err) { 
                                connection.rollback(function() {
                                    throw err;
                                });
                                
                                console.log('9 - Transaction Complete.\n');
                                console.log("9 - Ids of records inserted: " + result.insertId);

                            }
                            // connection.end();
                            // connection.release();
                        // Handle error after the release.
                        });


                        // if (error) throw error;

                    });



                };   // fin de boucle 'for'






            }); // fin de transaction


//        }); // FIN DE POOL CONNECTION (TEST)

        // pool.end(function (err) {
        //     // all connections in the pool have ended
        // });
        
            // connection.end('close', function(err) {

            //     if (err) {
            //         console.log('Oops! Unexpected closing of connection, lets reconnect back.'+ err);
            //         connection = mysql.createConnection(connection.config);
            //     } else {
            //         console.log('Connection closed normally.');
            //         console.log('662 - Données intégrées à la BDD ! \n\n');
            //         connection.end();
            //     };

            // });


        } //  fin de fonction insertDataSql();

        mailidinsert.mailidinsert(mailIndex, attachmentIndex, whitForMail, whitFormHistoryId);

    }, // fin de "function parse.Csv"




}; // fin de 'module.exports'
