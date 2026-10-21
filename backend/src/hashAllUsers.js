const db = require('./config/db');
const bcrypt = require('bcryptjs');

console.log('Buscando usuarios en la base de datos para hashear...');

db.query('SELECT * FROM usuarios', (err, users) => {
    if (err) {
        console.error('Error al consultar usuarios:', err);
        return;
    }

    if (users.length === 0) {
        console.log('No hay usuarios en la base de datos.');
        process.exit();
    }

    let processed = 0;

    users.forEach(u => {
        // Si la contraseña NO empieza con el prefijo de bcrypt ($2b$), significa que está en texto plano
        if (!u.password.startsWith('$2b$')) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(u.password, salt);

            db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, u.id], (updateErr) => {
                if (updateErr) {
                    console.error(`Error al hashear al usuario ${u.usuario}:`, updateErr);
                } else {
                    console.log(`¡Usuario '${u.usuario}' hasheado y actualizado con éxito!`);
                }
                
                checkFinish();
            });
        } else {
            console.log(`El usuario '${u.usuario}' ya tiene su contraseña hasheada.`);
            checkFinish();
        }
    });

    function checkFinish() {
        processed++;
        if (processed === users.length) {
            console.log('¡Proceso de actualización completado!');
            process.exit();
        }
    }
});