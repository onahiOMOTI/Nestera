import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
   app.useGlobalPipes(
     new ValidationPipe({
       whitelist: true,
       forbidNonWhitelisted: true,
       transform: true,
     }),
   );

   // CORS Configuration
   // Allows cross-origin requests from specified origins with credentials
   // Configure allowed origins via CORS_ORIGINS env variable (comma-separated)
   const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['*'];
   app.enableCors({
     origin: allowedOrigins,
     credentials: true,
     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
     allowedHeaders: [
       'Content-Type',
       'Authorization',
       'X-Requested-With',
       'Accept',
       'Origin',
     ],
     exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
     maxAge: 86400, // Preflight caching for 24 hours (in seconds)
   });

    // Swagger setup with comprehensive documentation
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Nestera API')
      .setDescription(
        'API documentation for the Nestera platform\n\n' +
        '## Authentication\n' +
        'All protected endpoints require a Bearer token obtained via the authentication endpoints.\n' +
        'Include the token in the `Authorization` header: `Bearer <your-token>`\n\n' +
        '## Rate Limiting\n' +
        'The API implements rate limiting to ensure fair usage:\n' +
        '- **General endpoints**: 100 requests per minute\n' +
        '- **Auth endpoints**: 5 requests per 15 minutes\n' +
        '- **RPC/Blockchain endpoints**: 10 requests per minute\n\n' +
        'Rate limit headers are included in responses:\n' +
        '- `X-RateLimit-Limit`: Request limit per window\n' +
        '- `X-RateLimit-Remaining`: Remaining requests in current window\n' +
        '- `X-RateLimit-Reset`: Time (seconds) until limit resets\n\n' +
        '## CORS Policy\n' +
        'Cross-origin requests are configured through the `CORS_ORIGINS` environment variable.\n' +
        '- Development: `CORS_ORIGINS=*` allows all origins\n' +
        '- Production: Specify exact origins (e.g., `CORS_ORIGINS=https://nestera.io,https://app.nestera.io`)\n\n' +
        '## Error Responses\n' +
        'All endpoints follow standard HTTP status codes:\n' +
        '- `200` - Success\n' +
        '- `201` - Created\n' +
        '- `400` - Bad request (validation error)\n' +
        '- `401` - Unauthorized (missing or invalid token)\n' +
        '- `403` - Forbidden (insufficient permissions)\n' +
        '- `404` - Resource not found\n' +
        '- `429` - Too many requests (rate limit exceeded)\n' +
        '- `500` - Internal server error',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port || 3001);
  const logger = app.get(Logger);
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Bootstrap] Application startup failed: ${message}`);
  process.exit(1);
});
