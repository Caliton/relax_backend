import {Table, Column, Model, DataType, HasOne} from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Person extends Model<Person> {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        field: "first_name"
    })
    FirstName: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        field: "last_name"
    })
    LastName: string;

    @Column({
        type: DataType.DATE,
        allowNull:false,
        field: "hiring_date"
    })
    HiringDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull:false,
        field: "birth_day"
    })
    BirthDay: Date;

    @HasOne(() => User)
    User: User;   
}

