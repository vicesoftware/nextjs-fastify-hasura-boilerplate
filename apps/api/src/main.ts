import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js frontend
  // Get allowed origins from environment variables
  const allowedOrigins = [
    'http://localhost:3000',
    'https://web-ubxh.onrender.com'
  ];
  
  // Add WEB_URL from environment if it exists
  if (process.env.WEB_URL) {
    allowedOrigins.push(process.env.WEB_URL);
    console.log(`Adding ${process.env.WEB_URL} to CORS allowed origins`);
  }
  
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
