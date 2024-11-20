import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Allow react frontend to access the backend
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  });

  app.listen(5000)
  .then(() => {
    console.log('Server is running on port 5000');
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
  });
}
bootstrap();
