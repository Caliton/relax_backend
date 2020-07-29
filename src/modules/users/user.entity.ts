import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    login: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;
}
