const cors = require('cors');
const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const app = express();
const port = Number(process.env.PORT) || 3000;
const dataDirectory = path.join(__dirname, 'data');
const dataFile = path.join(dataDirectory, 'solicitudes.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

let writeQueue = Promise.resolve();

async function readSolicitudes() {
  try {
    const content = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function persistSolicitud(solicitud) {
  const operation = writeQueue.then(async () => {
    await fs.mkdir(dataDirectory, { recursive: true });
    const solicitudes = await readSolicitudes();
    solicitudes.push(solicitud);

    const temporaryFile = `${dataFile}.tmp`;
    await fs.writeFile(temporaryFile, `${JSON.stringify(solicitudes, null, 2)}\n`, 'utf8');
    await fs.rename(temporaryFile, dataFile);
  });

  // Keep later writes usable even if one request fails to persist.
  writeQueue = operation.catch(() => {});
  return operation;
}

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'tarea3-solicitudes-backend' });
});

app.post('/solicitudes', async (request, response) => {
  const { asunto, descripcion, imagen = null, ubicacion = null } = request.body ?? {};

  if (typeof asunto !== 'string' || !asunto.trim()) {
    return response.status(400).json({ success: false, error: 'El asunto es obligatorio.' });
  }

  if (typeof descripcion !== 'string' || !descripcion.trim()) {
    return response.status(400).json({ success: false, error: 'La descripción es obligatoria.' });
  }

  if (asunto.length > 160 || descripcion.length > 5000) {
    return response.status(400).json({ success: false, error: 'El asunto o la descripción exceden el tamaño permitido.' });
  }

  if (imagen !== null && typeof imagen !== 'string') {
    return response.status(400).json({ success: false, error: 'La imagen debe ser una ruta de texto o null.' });
  }

  if (ubicacion !== null && (typeof ubicacion !== 'object' || Array.isArray(ubicacion))) {
    return response.status(400).json({ success: false, error: 'La ubicación debe ser un objeto o null.' });
  }

  const solicitud = {
    id: randomUUID(),
    asunto: asunto.trim(),
    descripcion: descripcion.trim(),
    imagen,
    ubicacion,
    estado: 'registrada',
    fechaRegistro: new Date().toISOString(),
  };

  try {
    await persistSolicitud(solicitud);
    return response.status(201).json({ success: true, solicitud });
  } catch (error) {
    console.error('No se pudo guardar la solicitud:', error);
    return response.status(500).json({ success: false, error: 'No se pudo guardar la solicitud.' });
  }
});

// Endpoint de consulta para revisar los registros durante esta práctica.
app.get('/solicitudes', async (_request, response) => {
  try {
    return response.json(await readSolicitudes());
  } catch (error) {
    console.error('No se pudieron leer las solicitudes:', error);
    return response.status(500).json({ error: 'No se pudieron leer las solicitudes.' });
  }
});

app.use((error, _request, response, _next) => {
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ success: false, error: 'El cuerpo debe ser JSON válido.' });
  }
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ success: false, error: 'El cuerpo excede el límite de 1 MB.' });
  }
  console.error('Error inesperado en la API:', error);
  return response.status(500).json({ success: false, error: 'Error interno del servidor.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API de solicitudes disponible en http://localhost:${port}`);
  console.log('En un teléfono de la misma red, usa la IPv4 de esta computadora en lugar de localhost.');
});
