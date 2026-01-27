#!/usr/bin/env bash
set -e

REPO="plotune/plotune-dl"
PKG_NAME="plotune"
ARCH="x86_64"

echo "Plotune installer starting"

# -------- DEP CHECK --------
command -v curl >/dev/null || { echo "curl is required"; exit 1; }
command -v tar >/dev/null || { echo "tar is required"; exit 1; }

# -------- GET LATEST RELEASE --------
API_URL="https://api.github.com/repos/$REPO/releases/latest"

RELEASE_JSON="$(curl -fsSL "$API_URL")"

TAG="$(echo "$RELEASE_JSON" | grep '"tag_name"' | cut -d '"' -f4)"
VERSION="${TAG#v}"

echo "Latest version: $VERSION"

# -------- CHECK INSTALLED VERSION --------
INSTALLED_VERSION="none"

if command -v dpkg-query >/dev/null 2>&1; then
    INSTALLED_VERSION="$(dpkg-query -W -f='${Version}' plotune 2>/dev/null || echo none)"
fi

if [[ "$INSTALLED_VERSION" != "none" ]]; then
    echo "Installed version: $INSTALLED_VERSION"

    if command -v dpkg >/dev/null 2>&1; then
        if dpkg --compare-versions "$INSTALLED_VERSION" ge "$VERSION"; then
            echo "Plotune is already up to date"
            exit 0
        fi
    fi
fi

# -------- SELECT ASSET --------
DEB_NAME="plotune-linux-x86_64.deb"
TAR_NAME="plotune-linux-x86_64.tar.gz"

DEB_URL="$(echo "$RELEASE_JSON" | grep "browser_download_url" | grep "$DEB_NAME" | cut -d '"' -f4)"
TAR_URL="$(echo "$RELEASE_JSON" | grep "browser_download_url" | grep "$TAR_NAME" | cut -d '"' -f4)"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

# -------- INSTALL DEB --------
if [[ -n "$DEB_URL" ]]; then
    echo "Installing via deb package"

    curl -fL "$DEB_URL" -o "$TMP_DIR/$DEB_NAME"

    sudo dpkg -i "$TMP_DIR/$DEB_NAME" || sudo apt -f install -y

    hash -r 2>/dev/null || true
    echo "Plotune installed successfully"
    exit 0
fi

# -------- FALLBACK TAR --------
if [[ -n "$TAR_URL" ]]; then
    echo "Installing via tar archive"

    curl -fL "$TAR_URL" -o "$TMP_DIR/$TAR_NAME"
    tar -xzf "$TMP_DIR/$TAR_NAME" -C "$TMP_DIR"

    sudo install -m755 "$TMP_DIR/plotune-linux-x86_64/plotune" /usr/local/bin/plotune

    hash -r 2>/dev/null || true
    echo "Plotune installed successfully"
    exit 0
fi

echo "No compatible Linux artifact found"
exit 1
