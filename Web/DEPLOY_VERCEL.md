# Desplegar drawsports.app en Vercel (con botón PRO)

El botón PRO que enlaza a `panel.drawsports.app` ya está en el código. Para verlo en producción:

## Opción 1: Vercel CLI (recomendado)

### 1. Iniciar sesión en Vercel
```bash
vercel login
```
Se abrirá el navegador para autenticarte.

### 2. Ir a la carpeta Web
```bash
cd "/Users/jorgelorenzo/Desktop/Desarrollo APPs/#VideoDraw/Web"
```

### 3. Vincular al proyecto existente (si drawsports.app ya está en Vercel)
```bash
vercel link
```
- Selecciona tu equipo/cuenta
- Si aparece el proyecto de drawsports.app, elige "Link to existing project"
- Si no existe, elige "Create new project" y luego asigna el dominio en el dashboard

### 4. Desplegar a producción
```bash
vercel --prod
```

---

## Opción 2: Desde el dashboard de Vercel

Si drawsports.app está conectado a un repositorio Git (GitHub/GitLab):

1. Copia los archivos de `Web/` al repositorio que usa Vercel
2. Haz commit y push
3. Vercel desplegará automáticamente

---

## Verificación

Tras el despliegue, visita:
- https://drawsports.app → botón "PRO" esquina superior izquierda
- https://drawsports.app/en → mismo botón en inglés

El botón enlaza a `panel.drawsports.app/es` o `panel.drawsports.app/en`.
