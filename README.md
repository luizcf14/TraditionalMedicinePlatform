<div align="center">

**Prerequisites:**  Node.js & Docker
 `npm install`

**Docker (PostgreSQL):**
- Build/Run: `docker compose up -d` (or use `npm run dev` which does this automatically)
- Stop: `docker compose down`

**Run:**
 (migrations) -> `npm run migrate`
 (front + db) -> `npm run dev` (starts both the vite frontend and postgres container, and stops postgres when exited)
 (back) -> `npm run server`

**Build:**
 `npm run build` (Builds both client and server)

**Run Production:**
 `npm start`


**NGROK Dev**
ngrok start --config ngrok.yaml --all  

**NGROK Prod**
ngrok http 3000 --config ngrok.yaml --all
