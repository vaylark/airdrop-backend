const { Connection } = require("@solana/web3.js");

// URL del nodo QuickNode
const QUICKNODE_RPC_URL = "https://delicate-greatest-brook.solana-mainnet.quiknode.pro/53910549b68afb02ca792acc6bb87cd7910f4b02";

// Crear la conexión con el nodo
const connection = new Connection(QUICKNODE_RPC_URL, "confirmed");

const main = async () => {
    try {
        console.log("Conectando al nodo...");
        // Obtener la versión del nodo
        const version = await connection.getVersion();
        console.log("Conexión exitosa.");
        console.log("Versión del nodo:", version);
    } catch (error) {
        console.error("Error conectándose al nodo:", error.message);
        if (error.response) {
            console.error("Respuesta del servidor:", error.response);
        }
    }
};

main();