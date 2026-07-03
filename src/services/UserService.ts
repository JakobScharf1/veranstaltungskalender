import { IUser } from "@/models/user"

export const UserService = {
    getUsers(): IUser[] {
        return MOCK_USERS
    },
}

const MOCK_USERS: IUser[] = [
    { id: 1, name: 'Max Mustermann', email: 'max.mustermann@mail.com', role: 'admin' },
    { id: 2, name: 'Erika Musterfrau', email: 'erika.musterfrau@mail.com', role: 'user' },
    { id: 3, name: 'John Doe', email: 'john.doe@mail.com', role: 'user', image: 'https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg' }
]
