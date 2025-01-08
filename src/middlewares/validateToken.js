const jwt = require('jsonwebtoken');
const deleteUser = require('../utils/deleteUser');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided', success: false });
    }

    // Extrae el token eliminando el prefijo "Bearer"
    const token = authHeader.split(' ')[1]; // Divide en ["Bearer", "<token>"] y toma el segundo elemento

    if (!token) {
        return res.status(401).json({ message: 'No token provided', success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.decodedToken = decoded; // Guarda el token decodificado para usarlo en la siguiente capa
        next();
    } catch (error) {
        // Elimina el usuario si el token es inválido o ha expirado
        if (error.name === "TokenExpiredError") {
            // Manejar explícitamente el error de expiración del token
            const decoded = jwt.decode(token); // Decodifica sin verificar para obtener la dirección de la wallet
            if (decoded && decoded.walletAddress) {
                try {
                    console.log("Token expirado. Eliminando registro asociado...");

                    const user = await deleteUser(decoded.walletAddress);

                    if (user) {
                        console.log("Registro eliminado exitosamente para wallet:", decoded.walletAddress);
                    } else {
                        console.warn("No se encontró registro para wallet:", decoded.walletAddress);
                    }                    
                } catch (error) {
                    console.error("Error eliminando usuario:", error);
                }

            }
            return res.status(410).json({ message: 'Invalid or expired link.', success: false });
        }
        
        return res.status(401).json({ message: 'Invalid or expired link.', success: false });
    }
};
