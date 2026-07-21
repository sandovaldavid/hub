ARG PLAYWRIGHT_VERSION=1.61.0
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

ARG BUN_VERSION=1.3.14
ARG PLAYWRIGHT_VERSION=1.61.0
ARG OH_MY_POSH_VERSION=29.34.0

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

ENV BUN_VERSION=${BUN_VERSION}
ENV PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}
ENV OH_MY_POSH_VERSION=${OH_MY_POSH_VERSION}
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /workspace
