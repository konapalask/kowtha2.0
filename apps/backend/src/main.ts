import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function main() {
  const app = await NestFactory.create(AppModule);
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Loan Verification API')
    .setDescription('The Loan Verification System API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);

  // Set the global prefix for the API
  app.setGlobalPrefix('api');
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS
  app.enableCors();
  await app.listen(3001);
}

main();