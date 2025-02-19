const fs = require('fs');
const yaml = require('js-yaml');

function readFiles(file, item, callback) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo el archivo:', err);
            return;
        }

        try {
            callback(item, data);
        } catch (e) {
            console.error('Error procesando el archivo YAML:', e);
        }
    });
}

function exchangeFiles(item, data) {
    // Leer el archivo YAML
    // Parseamos el archivo YAML
    const parsedData = yaml.load(data);
    // Verificamos si 'items' es un array
    if (Array.isArray(parsedData.projects)) {
        // Iteramos sobre cada elemento de la lista
        parsedData.projects.forEach((item, index) => {

            readFiles(item.main, item, function getName(item, data) {
                const parsedData = yaml.load(data);
                const filename = item.main.replace(/([a-zA-Z-0-9]+).yaml/, "exchange.json"); // Nombre del archivo

                title = parsedData.info.title

                var data = {
                    main: item.main.split("\\").pop(),
                    name: title,
                    organizationId: "3954b2e7-62d8-40ec-b0ef-866ee02e9891",
                    groupId: "3954b2e7-62d8-40ec-b0ef-866ee02e9891",
                    assetId: item.assetId,
                    apiVersion: item.apiVersion,
                    version: item.version,
                    descriptorVersion: "1.0.0"
                }

                fs.writeFile(filename, JSON.stringify(data), (err) => {
                    if (err) {
                        console.error('Error escribiendo el archivo:', err);
                    }
                });

                var spec  = item.main.replace(/([a-zA-Z-0-9]+).yaml/, "")
                if(spec.charAt(spec.length -1) == "/" || spec.charAt(spec.length -1) == "\\" )
                    spec = spec.substring(0,spec.length -1)
                fs.appendFile("specs.txt", "/" +spec+ "\n", (err) => {
                    if (err) {
                        console.log(err);
                    }
                }); 
            })
        });
    } else {
        console.error("No se encontró la clave 'items' o no es un array.");
    }
}

readFiles("catalog.yaml", null,exchangeFiles)
