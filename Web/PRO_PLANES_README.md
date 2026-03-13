# Página de planes PRO (espacio no público)

## Ubicación

La página con planes, precios y enlaces a Lemon Squeezy está en:

- **Español:** `Web/pro/planes/index.html`
- **Inglés:** `Web/pro/planes/en/index.html`

## URLs (tras deploy)

| Idioma | URL |
|--------|-----|
| Español | https://drawsports.app/pro/planes/ |
| Inglés | https://drawsports.app/pro/planes/en/ |

## Características de "no público"

- **`meta robots="noindex, nofollow"`** → Google no indexa la página
- **No hay enlaces** desde drawsports.app ni desde el botón PRO
- Solo accesible si conoces la URL (guárdala en favoritos)
- Badge "Vista previa · No indexada" en esquina inferior derecha

## Contenido

- 4 planes: 1, 3, 5 licencias + Plan a medida
- Precios: 89,99€, 285€, 450€
- Enlaces directos al checkout de Lemon Squeezy
- Plan a medida → mailto info@basketouch.com

## Cómo publicar cuando esté finalizada

1. **Opción A – Sustituir Próximamente:**  
   Reemplazar el contenido de `pro/index.html` por el de `pro/planes/index.html` (y quitar el badge de vista previa, cambiar robots a index,follow).

2. **Opción B – Cambiar el destino del botón PRO:**  
   Hacer que el botón PRO en drawsports.app enlace a `/pro/planes/` en lugar de `/pro/`.

3. **Opción C – Redirigir:**  
   Cuando quieras lanzar, hacer que `/pro/` redirija a `/pro/planes/` o mostrar planes directamente en `/pro/`.

## Deploy

Tras editar en `Web/`, ejecutar:

```bash
./sync-web-to-deploy.sh
cd drawsports-web-deploy && git add -A && git status
```

Luego commit y subir a Hostinger según tu flujo habitual.
