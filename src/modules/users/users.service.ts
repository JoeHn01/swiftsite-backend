import { Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from "./users.model";

@Injectable()
export class UsersService {
    private users: User[] = [];

    addUser(username: string, name: string, email: string, password: string): string {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const id = uuidv4();
        const createdAt = new Date();
        const updatedAt = new Date();
        const newUser = new User(id, username, name, email, hashedPassword, createdAt, updatedAt);
        this.users.push(newUser);
        return id;
    }

    getUsers() {
        return [...this.users];
    }

    getUser(id: string): User {
        const [user] = this.getUserById(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    updateUser(id: string, username: string, name: string, email: string, password: string): void {
        const [targetUser, index] = this.getUserById(id);
        if (!targetUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const hashedPassword = password ? bcrypt.hashSync(password, 10) : targetUser.password;
        const updatedUser = new User(id, username, name, email, hashedPassword, targetUser.createdAt, new Date());
        this.users[index] = updatedUser;
    }

    deleteUser(id: string): void {
        const [_, index] = this.getUserById(id);
        if (index === -1) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        this.users.splice(index, 1);
    }

    private getUserById(id: string): [User, number] {
        const index = this.users.findIndex(u => u.id === id);
        return [this.users[index], index];
    }
}
