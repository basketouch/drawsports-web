# Guía de imágenes para DrawSports Web

## Dónde colocar las imágenes en el servidor

Todas las imágenes van en la **raíz** del sitio (mismo nivel que `index.html`):

```
drawsports.app/                    ← Raíz del sitio
├── index.html
├── logo.png
├── jorge-lorenzo.jpg
├── imagen1.png
├── imagen2.png
├── imagen3.png
├── app-store-badge-es.svg
├── app-store-badge-en.svg
└── en/
    └── index.html
```

---

## Estructura de carpetas (local)

```
Web/
├── logo.png
├── jorge-lorenzo.jpg
├── imagen1.png
├── imagen2.png
├── imagen3.png
├── app-store-badge-es.svg
├── app-store-badge-en.svg
├── origen1.jpg              ← Foto en banquillo / élite
└── origen2.jpg              ← Foto en banquillo / élite
```

---

## Imágenes necesarias

### 1. `logo.png` (raíz de Web/)
- **Uso:** Favicon, icono del hero, App Store
- **Formato:** PNG con transparencia
- **Tamaño recomendado:** 512×512 px (mínimo 180×180)
- **Estado:** ✅ Ya existe

### 2. `jorge-lorenzo.jpg` (raíz de Web/)
- **Uso:** Foto en la sección "Detrás de DrawSports"
- **Formato:** JPG
- **Tamaño recomendado:** 600×800 px aprox. (proporción 3:4)
- **Estado:** ✅ Ya existe

### 3. `imagen1.png`, `imagen2.png`, `imagen3.png`
- **Uso:** Galería de capturas de la app (fondo rojo)
- **Formato:** PNG
- **Tamaño recomendado:** 1200×800 px aprox. (ratio 3:2)
- **Estado:** ✅ Ya existen

### 4. `app-store-badge-es.svg` ✅
- **Uso:** Botón "Descargar en App Store" (español)
- **Estado:** Incluido (mismo diseño que inglés; para "Descargar en" descarga desde Apple)

### 5. `app-store-badge-en.svg` ✅

### 6. `origen1.jpg`, `origen2.jpg` ⚠️ FALTA
- **Uso:** Sección "El Origen" – fotos en banquillo, con tensión, dando instrucciones o mirando datos
- **Formato:** JPG
- **Tamaño recomendado:** 800×600 px aprox. (ratio 4:3)
- **Uso:** Botón "Download on App Store" (inglés)
- **Estado:** Descargado desde Apple (badge oficial negro)

---

## Cómo obtener el badge de App Store

1. Entra en https://tools.applemediaservices.com/app-store/
2. Busca tu app (DrawSports, ID: 6756434573)
3. Elige el badge "Download on the App Store" (negro)
4. Selecciona idioma: **Español** → guarda como `app-store-badge-es.png`
5. Selecciona idioma: **English** → guarda como `app-store-badge-en.png`
6. Coloca ambos archivos en la raíz de `Web/`

**Alternativa:** Si solo quieres uno, usa el mismo archivo para ambos idiomas (por ejemplo `app-store-badge.png`) y avisa para ajustar el HTML.

---

## Resumen de tamaños

| Archivo | Ancho | Alto | Notas |
|---------|-------|------|-------|
| logo.png | 512 | 512 | Cuadrado |
| jorge-lorenzo.jpg | 600 | 800 | Retrato |
| imagen1/2/3.png | 1200 | 800 | Capturas app |
| app-store-badge-*.png | ~135 | 40–60 | Proporción fija Apple |
