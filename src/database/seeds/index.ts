import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seed.module';
import { LookupSeeder } from './lookup.seeder';
import { CategorySeeder } from './category.seeder';

async function runSeeders() {
  const app = await NestFactory.createApplicationContext(SeedsModule);

  const lookupSeeder = app.get(LookupSeeder);
  const categorySeeder = app.get(CategorySeeder);

  await lookupSeeder.run();
  await categorySeeder.run();

  await app.close();
  console.log('Database seeding completed successfully!');
}

runSeeders().catch((err) => {
  console.error(err);
  process.exit(1);
});
