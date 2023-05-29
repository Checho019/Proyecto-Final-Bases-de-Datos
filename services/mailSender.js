
const sendEmail = async (lista) => {
    // Crear Headers
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("api-key", "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");
    myHeaders.append("content-type", "application/json");

    // Enciar correo por cada persona 
    lista.forEach(element => {

        let codigo = element[0]
        let nombre = element[1] + element[2]
        let email = element[3]
        let proyecto = element[4]
        let text = `El estudiante ${nombre} con código ${codigo} ha cumplido 
        satisfactoriamente con los requisitos para que el grupo SINFORNICA UD al cual 
        participo el semestre 2023-1 sea valido como electiva del rpoyecto curricular 
        ${proyecto}.`

        // Json
        var raw = JSON.stringify({
            "sender": {
                "name": "Sergio Duarte",
                "email": "sergioduarte20013@gmail.com"
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

        fetch("https://api.brevo.com/v3/smtp/email", requestOptions)
            .then(response => response.text())
            .then(result => console.log("Correos enviados"))
            .catch(error => console.log('error', error));
    });
}

module.exports = {
    sendEmail
}
