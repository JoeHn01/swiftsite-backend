import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
    addUser(
        @Body('username') username: string,
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        const userId = this.userService.addUser( username, name, email, password );
        return {
            id: userId,
        }
    }

    @Get()
    getAllUsers() {
        return this.userService.getUsers();
    }

    @Get(':userId')
    getUser(@Param('userId') userId: string) {
        return this.userService.getUser(userId);
    }

    @Put(':userId')
    updateUser(
        @Param('userId') userId: string,
        @Body('username') username: string,
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.userService.updateUser(userId, username, name, email, password);
    }

    @Delete(':userId')
    deleteUser(@Param('userId') userId: string) {
        this.userService.deleteUser(userId)
    }
}