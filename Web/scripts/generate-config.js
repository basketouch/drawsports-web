#!/usr/bin/env node
/**
 * Genera js/config.js desde variables de entorno (Vercel).
 *
 * El checkout de DrawSports PRO es Paddle, el mismo motor que CutSports: el
 * webhook `paddle-webhook` da de alta la organización y el acceso PRO.
 *
 * Variables:
 *   PADDLE_CLIENT_TOKEN        — client-side token live (Paddle → Authentication)
 *   PADDLE_ENVIRONMENT         — production | sandbox (default: production)
 *   PADDLE_PRICE_DRAWSPORTS_1     — precio de 1 licencia (89,99 €)
 *   PADDLE_PRICE_DRAWSPORTS_3     — precio de 3 licencias
 *   PADDLE_PRICE_DRAWSPORTS_5     — precio de 5 licencias
 *   PADDLE_PRICE_DRAWSPORTS_ADDON — add-on iPad para clientes CutSports Pro (51 €)
 *   SUPABASE_URL / SUPABASE_ANON_KEY — elegibilidad add-on
 *
 * Sin token o sin precios, los botones se quedan como consulta por email: la
 * página sigue siendo válida, solo que no vende.
 */
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const salida = path.join(raiz, "js", "config.js");

const limpio = (v) => (v || "").trim();
const token = limpio(process.env.PADDLE_CLIENT_TOKEN);
const entorno = limpio(process.env.PADDLE_ENVIRONMENT) || "production";
const precios = {
  1: limpio(process.env.PADDLE_PRICE_DRAWSPORTS_1),
  3: limpio(process.env.PADDLE_PRICE_DRAWSPORTS_3),
  5: limpio(process.env.PADDLE_PRICE_DRAWSPORTS_5),
};
const priceAddon = limpio(process.env.PADDLE_PRICE_DRAWSPORTS_ADDON);
const supabaseUrl = limpio(process.env.SUPABASE_URL);
const supabaseAnonKey = limpio(process.env.SUPABASE_ANON_KEY);

const sinToken = !token || /XXXX/i.test(token);

const contenido = `// Auto-generado por scripts/generate-config.js — no editar a mano
window.DRAWSPORTS_CONFIG = {
  paddleEnvironment: ${JSON.stringify(entorno)},
  paddleClientToken: ${JSON.stringify(sinToken ? "" : token)},
  prices: ${JSON.stringify(precios)},
  priceAddon: ${JSON.stringify(priceAddon)},
  supabaseUrl: ${JSON.stringify(supabaseUrl)},
  supabaseAnonKey: ${JSON.stringify(supabaseAnonKey)},
  panelUrl: "https://panel.drawsports.app/",
  helpEmail: "help@basketouch.com",
};
`;

fs.mkdirSync(path.dirname(salida), { recursive: true });
fs.writeFileSync(salida, contenido, "utf8");

if (sinToken) {
  console.warn("generate-config: sin PADDLE_CLIENT_TOKEN — los planes quedan como consulta por email");
} else {
  const faltan = Object.entries(precios).filter(([, v]) => !v).map(([k]) => k);
  if (faltan.length) console.warn("generate-config: faltan precios para:", faltan.join(", "));
  console.log("generate-config: js/config.js escrito");
}
