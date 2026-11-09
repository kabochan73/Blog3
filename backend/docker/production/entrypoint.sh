#!/bin/sh
set -e

export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

php artisan migrate --force

exec supervisord -c /etc/supervisord.conf
