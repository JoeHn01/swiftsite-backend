import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { User } from "./users.model";

@Injectable()
export class UsersService {
    private users: User[] = [];

    addUser( username: string, name: string, email: string, password: string ) {
        const id = uuidv4();
        const newUser = new User(id, username, name, email, password);
        this.users.push(newUser);
        return id;
    }

    getUsers() {
        return [ ... this.users];
    }

    getUser(id: string) {
        return this.getUserById(id)[0];
    }

    updateUser(
        id: string,
        username: string,
        name: string,
        email: string,
        password: string
    ) {
        const [targetUser, index] = this.getUserById(id);
        const par = { ... targetUser, username, name, email, password};
        const updatedUser = new User(id, par.username, par.name, par.email, par.password);
        this.users[index] = updatedUser;
    }

    deleteUser(id: string) {
        const [_, index] = this.getUserById(id);
        this.users.splice(index, 1);

    }

    private getUserById(id: string): [User, number] {
        const index = this.users.findIndex(u => u.id == id);
        return [this.users[index], index];
    }
}