# Probar la aplicación

## 1) Levantar backend
1. Abrir terminal en:
   - `tu_ruta\back\api-c`
2. Ejecutar:
   - `npm install` (si no está instalado)
   - `npm run start:dev`
3. Verificar que el backend arranca en `http://localhost:3000`

## 2) Levantar frontend
1. Abrir otra terminal en:
   - `tu_ruta\front`
2. Ejecutar:
   - `npm install` (si no está instalado)
   - `npm run start`
3. Verificar que el frontend arranca en el puerto que indica la terminal (normalmente `http://localhost:4200`)

## 3) Levantar MCP bridge
1. Abrir otra terminal en:
   - `tu_ruta\mcp`
2. Ejecutar:
   - `npm install` (si no está instalado)
   - `npx tsx src/index.ts`

3. Dejar este bridge abierto.

## 4) Abrir MCP inspector
1. Abrir una terminal nueva en:
   - `tu_ruta\mcp`
2. Ejecutar:
   - `npx @modelcontextprotocol/inspector npx tsx src/index.ts`
3. El inspector se conectará al bridge que ya debe estar corriendo.


