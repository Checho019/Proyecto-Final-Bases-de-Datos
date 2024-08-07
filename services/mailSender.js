
const sendEmail = async (lista) => {
    // Crear Headers
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    // myHeaders.append();
    myHeaders.append("content-type", "application/json");

    // Enciar correo por cada persona 
    await lista.forEach(async element => {

        let codigo = element[0]
        let nombre = element[1] + ' ' + element[2]
        let email = element[3]
        let proyecto = element[4]
        let text = `El estudiante ${nombre} con código ${codigo} ha cumplido 
        satisfactoriamente con los requisitos para que el grupo SINFORNICA UD al cual 
        participo el semestre 2023-1 sea valido como electiva del proyecto curricular 
        ${proyecto}.`

        // Json
        var raw = JSON.stringify({
            "sender": {
                "name": "Sergio Duarte",
                "email": "alexmason@gmail.com"
            },
            "to": [
                {
                    "email": email,
                    "name": nombre 
                }
            ],
            "subject": "ELECTIVA CURSADA EN EL GRUPO SINFONICA UD - PERIODO 2023-1",
            "htmlContent": `<html><head></head><body><H1>Felicidades</H1><p>${text}</p></body></html>`
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("https://api.brevo.com/v3/smtp/email", requestOptions)
            .then(response => response.text())
            .then(result => console.log("Correos enviados"))
            .catch(error => console.log('error', error));
    });
}

module.exports = {
    sendEmail
}
