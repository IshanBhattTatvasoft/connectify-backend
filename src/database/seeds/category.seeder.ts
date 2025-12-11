import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/modules/lookups/model/categories.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async run() {
    const categories = [
      'Technology',
      'Sports',
      'History',
      'Geography',
      'Economy',
      'Current Affairs',
      'Art',
      'Life Lessons',
      'Health & Fitness',
    ];

    for (let cat of categories) {
      const code = cat.toUpperCase().replace(/ /g, '_');
      const exists = await this.categoryModel.findOne({ code });

      if (!exists) {
        await this.categoryModel.create({ name: cat, code });
      }
    }
  }
}
