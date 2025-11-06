import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schema/users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 👉 Create a new user
  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  // 👉 Get all users
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // 👉 Get user by ID
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }
}
