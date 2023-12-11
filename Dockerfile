# ref: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

# 我们的： baichuan-cr-registry-vpc.cn-beijing.cr.aliyuncs.com/devops/node:18.17.1
# 我们的： FROM baichuan-cr-registry-vpc.cn-beijing.cr.aliyuncs.com/devops/node:18.17.1-bullseye-slim
FROM baichuan-cr-registry-vpc.cn-beijing.cr.aliyuncs.com/devops/node:18.17.1-bullseye-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN #apk add --no-cache libc6-compat
WORKDIR /app

# generated prisma files
COPY prisma ./prisma/

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY .env .env.development .env.production ./

#RUN yarn config set registry 'http://mirrors.cloud.tencent.com/npm/'
# ref: https://developer.aliyun.com/mirror/NPM
RUN #npm config set registry https://registry.npmmirror.com

# ref: https://stackoverflow.com/a/66165135/9422455
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn
# RUN --mount=type=bind,target=/root/.yarn,rw YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile;

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# generated 要同步过去，因为被忽视了
COPY --from=deps /app/prisma/generated ./prisma/generated
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION=1
RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# docker 不允许 80
EXPOSE 3000
ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]