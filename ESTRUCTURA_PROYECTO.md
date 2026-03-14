# Estructura del proyecto DrawSports

## Resumen: qué es cada cosa

| Carpeta | Qué es | Dónde se despliega | Repo Git |
|---------|--------|-------------------|----------|
| **drawsports-web-deploy/** | Web estática (drawsports.app) | Hostinger | ✅ Sí |
| **drawsports-panel/** | Panel PRO (Next.js) | panel.drawsports.app (Vercel) | ✅ Sí |
| **VideoDraw/** | Edge Functions, Supabase | Supabase Cloud | ✅ Sí |
| **Web/** | Copia de trabajo de la web | — | ❌ No (solo referencia) |
| **panel/** | Copia local del panel (sin git) | — | ❌ No |

---

## Regla de oro: fuentes de verdad

- **Web (drawsports.app)**: edita en `drawsports-web-deploy/Web/` → commit → sube a Hostinger
- **Panel (panel.drawsports.app)**: edita en `drawsports-panel/` → commit → push → Vercel despliega
- **VideoDraw (Supabase)**: edita en `VideoDraw/` → commit → push → Supabase despliega

---

## El lío de las duplicaciones

### Web
- `Web/` (raíz) = copia de trabajo, a veces más actual
- `drawsports-web-deploy/Web/` = **fuente de verdad** para Hostinger

**Si editas en Web/**: ejecuta el script antes de commit:
```bash
./sync-web-to-deploy.sh
cd drawsports-web-deploy && git add -A && git status
```

### Panel
- `panel/` = copia local sin git (puede estar desactualizada)
- `drawsports-panel/` = **fuente de verdad** para Vercel

**Siempre trabaja en drawsports-panel/**, no en panel/.

---

## Recomendación para simplificar

1. **Eliminar `panel/`** si no la usas: es redundante con drawsports-panel
2. **Elegir una sola fuente para Web**:
   - Opción A: Trabajar solo en `drawsports-web-deploy/Web/` y olvidar `Web/`
   - Opción B: Trabajar en `Web/` y tener un script que sincronice a drawsports-web-deploy antes de deploy

---

## URLs de producción

| URL | Contenido |
|-----|-----------|
| drawsports.app | Web principal |
| drawsports.app/pro | Landing PRO (planes, compra) |
| drawsports.app/pro/en | Landing PRO inglés |
| panel.drawsports.app | Panel PRO (login, dashboard, equipo) |
