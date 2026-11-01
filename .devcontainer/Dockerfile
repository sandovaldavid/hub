ARG NODE_VARIANT=24-trixie
ARG BUN_VERSION=1.3.14
ARG PLAYWRIGHT_VERSION=1.61.0

FROM mcr.microsoft.com/devcontainers/typescript-node:5-${NODE_VARIANT}

ARG BUN_VERSION
ARG PLAYWRIGHT_VERSION
ARG TARGETARCH

ENV DEBIAN_FRONTEND=noninteractive \
    BUN_INSTALL=/home/node/.bun \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Verify the pinned Bun release archive against Bun's published SHASUMS256.txt.
# Do not execute the mutable bun.sh installer.
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends unzip; \
    rm -rf /var/lib/apt/lists/*; \
    case "${TARGETARCH}" in \
        amd64) bun_arch="x64"; bun_sha="951ee2aee855f08595aeec6225226a298d3fea83a3dcd6465c09cbccdf7e848f" ;; \
        arm64) bun_arch="aarch64"; bun_sha="a27ffb63a8310375836e0d6f668ae17fa8d8d18b88c37c821c65331973a19a3b" ;; \
        *) echo "Unsupported TARGETARCH: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl --proto '=https' --tlsv1.2 -fsSL \
        "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-${bun_arch}.zip" \
        -o /tmp/bun.zip; \
    printf '%s  %s\n' "${bun_sha}" /tmp/bun.zip | sha256sum --check --status; \
    unzip -q /tmp/bun.zip -d /tmp/bun; \
    install -m 0755 "/tmp/bun/bun-linux-${bun_arch}/bun" /usr/local/bin/bun; \
    rm -rf /tmp/bun /tmp/bun.zip; \
    bun --version

RUN mkdir -p "${PLAYWRIGHT_BROWSERS_PATH}" \
    && npx --yes "playwright@${PLAYWRIGHT_VERSION}" install --with-deps chromium webkit firefox \
    && chmod -R a+rX "${PLAYWRIGHT_BROWSERS_PATH}"

ENV PATH="/home/node/.bun/bin:/home/node/.local/bin:${PATH}" \
    BUN_VERSION="${BUN_VERSION}" \
    PLAYWRIGHT_VERSION="${PLAYWRIGHT_VERSION}"

WORKDIR /workspace
