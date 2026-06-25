#!/bin/sh
# Generates a throwaway self-signed cert for local HTTPS testing with
# docker-compose's nginx service. NOT for production — for production,
# put a real fullchain.pem/privkey.pem here (e.g. from Let's Encrypt/certbot).
set -e

cd "$(dirname "$0")"

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout privkey.pem \
  -out fullchain.pem \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "Generated ssl/fullchain.pem and ssl/privkey.pem (self-signed, localhost only)."
