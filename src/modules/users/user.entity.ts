import {Table, Column, Model, DataType, HasOne, PrimaryKey, ForeignKey, Unique, BelongsTo} from 'sequelize-typescript';
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
        type: DataType.STRING
    })
    PersonId: string;

    @BelongsTo(() => Person)
    Person: Person;
}
