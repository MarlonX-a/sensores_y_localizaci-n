# Backend de solicitudes

API de práctica con Express. Guarda los registros en `data/solicitudes.json` para que persistan entre reinicios del servidor.

## Iniciar

Desde esta carpeta:

```powershell
npm install
npm start
```

El servidor escucha en el puerto `3000` y en todas las interfaces de red.

## Rutas

- `GET /health`: confirma que el servidor está activo.
- `POST /solicitudes`: registra una solicitud y responde con HTTP `201` y `{ "success": true, "solicitud": ... }` solo después de guardarla.
- `GET /solicitudes`: muestra los registros para revisar la práctica.

El `POST` espera un JSON con `asunto` y `descripcion`; `imagen` y `ubicacion` son opcionales. `imagen` se guarda como ruta de texto, no carga el archivo de imagen.

Para conectar un Android físico, el teléfono y la computadora deben estar en la misma red. La app debe usar la dirección IPv4 local de esta computadora, no `localhost`. Este backend es para desarrollo y demostración en una red confiable; no tiene autenticación ni está preparado para exponerse públicamente.
