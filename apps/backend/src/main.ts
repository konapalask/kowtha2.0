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

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://app.cakowtha.co.in',
      'https://kowtha.beyondscale.tech',
      'https://app.cakowtha.co.in/',
      'http://10.0.2.2:8081',  // React Native development server in Android emulator
      'http://localhost:8081'   // React Native development server
    ],
    methods: '*',
    allowedHeaders: '*',
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

  // await app.listen(process.env.PORT);
  await app.listen(process.env.PORT || 3001, '0.0.0.0');

}
bootstrap();