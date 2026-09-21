FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/docs/package.json ./apps/docs/

RUN pnpm install --frozen-lockfile --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/apps/docs/node_modules ./apps/docs/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_SITE_URL=https://tamga.org.tr
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN pnpm --filter tamga-docs build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
# PUBLIC'I STANDALONE KOPYALAMIYOR, ve bu satır bir kesintiden doğdu.
# `output: "standalone"` minimal bir `server.js` üretiyor; Next'in kendi
# dokümanı (`output.md`) açıkça söylüyor: bu sunucu `public` ve `.next/static`
# klasörlerini VARSAYILAN OLARAK KOPYALAMIYOR, ikisi de elle taşınacak.
# `.next/static` üstteki satırda zaten taşınıyordu; `public` yoktu çünkü
# klasörün kendisi yoktu. Logolar oraya konunca canlıda üçü de 500 döndü:
# HTML doğruydu, dosya sunucuda yoktu. `public/` altına yeni bir dosya
# eklerken bu satırın durduğunu kontrol et.
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public

RUN mkdir -p ./apps/docs/.next/cache && chown -R nextjs:nodejs ./apps/docs/.next

USER nextjs
EXPOSE 3000

CMD ["node", "apps/docs/server.js"]
