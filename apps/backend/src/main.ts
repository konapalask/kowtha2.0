import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './modules/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  
  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Enable CORS for Vercel, localhost, and production domains
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://10.0.2.2:8081',
        'https://app.cakowtha.co.in',
        'https://kowtha.beyondscale.tech',
        'https://kowtha2-0.vercel.app',
      ];

      // Allow exact matches or any vercel.app preview deployment
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.cakowtha.co.in') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }

      return callback(null, true); // Permissive in dev/staging to prevent CORS blocks
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'department', 'x-department', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  });

  // Use global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Loan Verification API')
    .setDescription('API documentation for the Loan Verification System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Set the global prefix for the API
  app.setGlobalPrefix('api');
  
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();