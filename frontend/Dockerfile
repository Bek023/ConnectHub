FROM ghcr.io/cirruslabs/flutter:stable AS build
WORKDIR /app
COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get
COPY . .
ARG API_URL=http://localhost:4000/api/v1
ARG WS_URL=http://localhost:4000
RUN flutter build web --release --dart-define=API_URL=${API_URL} --dart-define=WS_URL=${WS_URL}

FROM nginx:alpine
COPY --from=build /app/build/web /usr/share/nginx/html
EXPOSE 80
