ARG PLAYWRIGHT_VERSION=1.61.0
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=${USER_UID}
ARG BUN_VERSION=1.3.14
ARG PLAYWRIGHT_VERSION=1.61.0
ARG OH_MY_POSH_VERSION=29.34.0

RUN touch /var/mail/ubuntu && chown ubuntu /var/mail/ubuntu && userdel -r ubuntu || true \
    && groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} --shell /usr/bin/zsh -m ${USERNAME} \
    && apt-get update \
    && apt-get install -y --no-install-recommends sudo curl wget zsh \
    && echo "${USERNAME} ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME} \
    && case "$(dpkg --print-architecture)" in \
         amd64) posh_arch="amd64" ;; \
         arm64) posh_arch="arm64" ;; \
         *) echo "Unsupported architecture: $(dpkg --print-architecture)" >&2; exit 1 ;; \
       esac \
    && curl -fsSL \
         "https://github.com/JanDeDobbeleer/oh-my-posh/releases/download/v${OH_MY_POSH_VERSION}/posh-linux-${posh_arch}" \
         -o /usr/local/bin/oh-my-posh \
    && chmod 0755 /usr/local/bin/oh-my-posh \
    && test "$(oh-my-posh version)" = "${OH_MY_POSH_VERSION}" \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p -m 755 /etc/apt/keyrings \
    && wget -qO /etc/apt/keyrings/githubcli-archive-keyring.gpg \
         https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] \
         https://cli.github.com/packages stable main" \
         | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh unzip \
    && rm -rf /var/lib/apt/lists/*

USER ${USERNAME}
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}"
ENV PATH="/home/${USERNAME}/.bun/bin:${PATH}"
ENV BUN_VERSION=${BUN_VERSION}
ENV PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}
ENV OH_MY_POSH_VERSION=${OH_MY_POSH_VERSION}
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV SHELL=/usr/bin/zsh

WORKDIR /workspace
