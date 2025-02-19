const fs = require('fs');
const yaml = require('js-yaml');

// Obtener el string (valor que se pasará al script)
const inputString = process.argv[2];  // El valor se pasa como primer argumento al ejecutar el script

// Ruta del archivo YAML
const input = 'catalog.yaml';
const output = 'catalog_back.yaml';

function leerYAML(archivo) {
    try {
        return yaml.load(fs.readFileSync(archivo, 'utf8'));
    } catch (e) {
        console.error(`Error leyendo el archivo ${archivo}: ${e}`);
        process.exit(1);
    }
}

// Función para escribir el archivo YAML actualizado
function escribirYAML(archivo, data) {
    try {
        fs.writeFileSync(archivo, yaml.dump(data), 'utf8');
        console.log(`Archivo ${archivo} actualizado correctamente.`);
    } catch (e) {
        console.error(`Error escribiendo el archivo ${archivo}: ${e}`);
        process.exit(1);
    }
}

function exchangeFiles(file, data) {
    // Leer el archivo YAML
    // Parseamos el archivo YAML
    let parsedData = leerYAML(file);
    // Verificamos si 'items' es un array
    if (Array.isArray(parsedData.projects)) {
        // Iteramos sobre cada elemento de la lista
        parsedData.projects.forEach((item, index) => {

            if (item.main == data) {
                let dataYAML = leerYAML(output);

                if (dataYAML == null) {
                    dataYAML = {projects:[]};
                }
                // Agregar el nuevo elemento al arreglo
                dataYAML.projects.push(item);

                console.log(dataYAML)
                console.log(yaml.dump(dataYAML))
                // Escribir el archivo YAML actualizado
                escribirYAML(output, dataYAML);
            }
        });
    } else {
        console.error("No se encontró la clave 'items' o no es un array.");
    }
}

exchangeFiles(input, inputString)