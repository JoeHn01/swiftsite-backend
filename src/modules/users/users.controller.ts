import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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
        const userId = await this.userService.addUser(username, name, email, password, templateIds);
        return { _id: userId };
    }

    @Get()
    async getAllUsers() {
        return this.userService.getUsers();
    }

    @Get(':userId')
    async getUser(@Param('userId') userId: string) {
        return this.userService.getUser(userId);
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
        return this.userService.updateUser(userId, username, name, email, password, templateIds);
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        return this.userService.deleteUser(userId);
    }
}
