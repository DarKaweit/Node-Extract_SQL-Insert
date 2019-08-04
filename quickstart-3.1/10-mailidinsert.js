/*------------------------------------------------------------------------
                6 - Insertion de l'ID des mails en BDD (MySQL)
-------------------------------------------------------------------------*/


// Modules complémentaires NodeJS :
const mysql2 = require('mysql2');

const connection = mysql2.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_sakana"
});


module.exports = {


    mailidinsert: function mailIdInsert(auth, whitForMail, mailIndex, whitFormHistoryId) {

        if (whitFormHistoryId == "") {                
            whitFormHistoryId = null;
        };

        //---- On passe d'une date au format '.xlsx' (ex: 43453 = le nombre de jours passées depuis le '01-01-1900') à la date voulue au format GMT :
        let formatdates = new Date((whitFormHistoryId - (25567 + 2)) * 86400 * 1000); 
        
        //---- on passe la nouvelle date au format YYYY-MM-DD :
        let reformatdates = formatdates.getFullYear() +"-"+ (parseInt(formatdates.getMonth()) + 1) +"-"+ formatdates.getDate();   
        //  console.log(reformatdates);

        let mailTimeValues =  [
            whitForMail, 
            reformatdates
        ];

        console.log('10 - mailTimeValues : ' + mailTimeValues);
        // let mailInsert = connection.query('INSERT INTO id_mails (mail_number, mail_date) VALUES (?, ?)', mailTimeValues, function (err, results) { // marche pas !

        let mailInsert = connection.query('INSERT INTO mail_infos (mail_number) VALUES (?)', mailIndex, function (err, results) {
            if (err) {
                console.log('10 - mailInsert erreur : ');
                // console.log (err);
                throw err;
            } else {
                console.log('10 - mailInsert values: ');
                console.log (mailInsert.values);
                console.log('10 - result :');
                console.log(results);
                console.log('10 - mailInsert :'+ mailIndex, whitForMail, whitFormHistoryId);

                // recupidattachment.recupidattachment(auth, whitForMail, mailIndex, whitForMail, whitFormHistoryId);
            
            };
        });
                    
    } // fin de fonction 'mailIdInsert'


}; // fin de 'module.exports'
