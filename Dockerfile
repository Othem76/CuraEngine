# Utiliser une image de base Ubuntu
FROM ubuntu:22.04

SHELL ["/bin/bash", "-c"]
# Variables d'environnement pour la version de Python et Conan
ENV PYTHON_VERSION=3
ENV CONAN_VERSION=1.65

RUN apt-get update && apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    python${PYTHON_VERSION} \
    python3-pip \
    git \
    build-essential \
    ninja-build \
    gcc \
    libssl-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Installer une version plus récente de CMake
RUN wget https://github.com/Kitware/CMake/releases/download/v3.27.4/cmake-3.27.4-linux-x86_64.sh && \
    chmod +x cmake-3.27.4-linux-x86_64.sh && \
    ./cmake-3.27.4-linux-x86_64.sh --skip-license --prefix=/usr/local && \
    rm cmake-3.27.4-linux-x86_64.sh

# Mettre à jour les alternatives pour pointer vers Python 3
RUN update-alternatives --install /usr/bin/python python /usr/bin/python${PYTHON_VERSION} 1

# Mise à jour gcc
RUN apt update && apt-get install software-properties-common -y
RUN apt update
RUN add-apt-repository ppa:ubuntu-toolchain-r/test
RUN apt update
RUN apt install g++-13 gcc-13 -y
RUN apt install g++-10 gcc-10 -y
RUN update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-13 13
RUN update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-13 13

# Installer Conan
RUN pip3 install conan==${CONAN_VERSION}

# Configurer Conan pour utiliser les paramètres spécifiques à CuraEngine
RUN conan config install https://github.com/ultimaker/conan-config.git && \
    conan profile new default --detect --force

# Cloner le dépôt CuraEngine depuis GitHub
COPY . /app

# Définir le répertoire de travail
WORKDIR /app

COPY emscripten.profile /root/.conan/profiles/

RUN git clone https://github.com/emscripten-core/emsdk.git /emsdk && \
    cd /emsdk && \
    ./emsdk install latest && \
    ./emsdk activate latest && \
    source ./emsdk_env.sh

# Installer et compiler CuraEngine en mode Release
RUN conan install . -pr emscripten.profile --build=missing --update -o protobuf:shared=True
RUN cmake --preset release
RUN cmake --build --preset release


# Définir le point d'entrée pour exécuter CuraEngine
ENTRYPOINT ["tail", "-f", "/dev/null"]
