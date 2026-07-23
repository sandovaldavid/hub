ARG NODE_VARIANT=24-trixie
ARG BUN_VERSION=1.3.14
ARG PLAYWRIGHT_VERSION=1.61.0

FROM mcr.microsoft.com/devcontainers/typescript-node:5-${NODE_VARIANT}

ARG BUN_VERSION
ARG PLAYWRIGHT_VERSION

ENV DEBIAN_FRONTEND=noninteractive \
    BUN_INSTALL=/home/node/.bun \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN curl --proto '=https' --tlsv1.2 -fsSL https://bun.sh/install -o /tmp/bun-install.sh \
    && chmod 0755 /tmp/bun-install.sh \
    && sudo -u node -H env BUN_INSTALL=/home/node/.bun \
        bash /tmp/bun-install.sh "bun-v${BUN_VERSION}" \
    && rm -f /tmp/bun-install.sh \
    && mkdir -p "${PLAYWRIGHT_BROWSERS_PATH}" \
    && npx --yes "playwright@${PLAYWRIGHT_VERSION}" install --with-deps chromium webkit \
    && chmod -R a+rX "${PLAYWRIGHT_BROWSERS_PATH}"

ENV PATH="/home/node/.bun/bin:/home/node/.local/bin:${PATH}"
