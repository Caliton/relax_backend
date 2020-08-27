import {Table, Column, Model, DataType, ForeignKey, Unique, BelongsTo} from 'sequelize-typescript';
import { Person } from '../person/person.entity';

@Table
export class User extends Model<User> {
    @Unique
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

    @ForeignKey(() => Person)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    personId: number;

    @BelongsTo(() => Person)
    person: Person;

}
