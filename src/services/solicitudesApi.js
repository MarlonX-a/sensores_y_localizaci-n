// Usa la IPv4 de la computadora donde se ejecuta el backend.
// Si cambia la red o la dirección, actualiza este valor.
const API_BASE_URL = 'http://192.168.1.21:3000';

export async function guardarSolicitudEnBackend(datos) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error(
      'No se pudo conectar con el backend. Comprueba que esté iniciado y que el teléfono y la computadora estén en la misma red Wi-Fi.',
    );
  }

  let resultado;
  try {
    resultado = await response.json();
  } catch {
    throw new Error('El backend respondió con un formato inesperado.');
  }

  if (!response.ok || !resultado.success) {
    throw new Error(resultado.error || `Error del servidor (${response.status}).`);
  }

  return resultado.solicitud;
}
