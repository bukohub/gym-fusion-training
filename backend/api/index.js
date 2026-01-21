const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const { AppModule } = require('../dist/src/app.module');

let app;

async function createApp() {
  if (app) {
    return app;
  }

  app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: [
      configService.get('CORS_ORIGIN'),
      'https://frontend-opal-ten-97.vercel.app',
      'http://localhost:5173',
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.init();
  return app;
}

module.exports = async (req, res) => {
  const server = await createApp();
  const expressApp = server.getHttpAdapter().getInstance();

  // Handle the request
  expressApp(req, res);
};