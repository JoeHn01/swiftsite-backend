import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
    async addUser(
        @Body('username') username: string,
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('templateIds') templateIds: string[],
    ) {
        try {
            const userId = await this.userService.addUser(username, name, email, password, templateIds);
            return { _id: userId };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to create user', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAllUsers() {
        try {
            return await this.userService.getUsers();
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':userId')
    async getUser(@Param('userId') userId: string) {
        try {
            return await this.userService.getUser(userId);
        } catch (error) {
            throw new HttpException(error.message || 'User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Put(':userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body('username') username: string,
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('templateIds') templateIds: string[],
    ) {
        try {
            return await this.userService.updateUser(userId, username, name, email, password, templateIds);
        } catch (error) {
            throw new HttpException(error.message || 'Failed to update user', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        try {
            const userExists = await this.userService.getUser(userId);
            if (!userExists) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            await this.userService.deleteUser(userId);
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to delete user', HttpStatus.BAD_REQUEST);
        }
    }    
}
