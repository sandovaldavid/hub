ARG NODE_VARIANT=22-bookworm
FROM mcr.microsoft.com/devcontainers/javascript-node:1-${NODE_VARIANT}

ARG BUN_VERSION=1.3.14
ARG PLAYWRIGHT_VERSION=1.61.0
ARG OH_MY_POSH_VERSION=29.34.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends unzip \
    && rm -rf /var/lib/apt/lists/*

RUN case "$(dpkg --print-architecture)" in \
         amd64) posh_arch="amd64" ;; \
         arm64) posh_arch="arm64" ;; \
         *) echo "Unsupported architecture: $(dpkg --print-architecture)" >&2; exit 1 ;; \
       esac \
    && curl -fsSL \
         "https://github.com/JanDeDobbeleer/oh-my-posh/releases/download/v${OH_MY_POSH_VERSION}/posh-linux-${posh_arch}" \
         -o /usr/local/bin/oh-my-posh \
    && chmod 0755 /usr/local/bin/oh-my-posh \
    && test "$(oh-my-posh version)" = "${OH_MY_POSH_VERSION}"

RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/usr/local bash -s "bun-v${BUN_VERSION}"

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx playwright install --with-deps chromium

ENV BUN_VERSION=${BUN_VERSION}
ENV PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}
ENV OH_MY_POSH_VERSION=${OH_MY_POSH_VERSION}

WORKDIR /workspace
