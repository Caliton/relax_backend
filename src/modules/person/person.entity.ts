import {Table, Column, Model, DataType, HasOne} from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Person extends Model<Person> {
    @Column({
        type: DataType.STRING,
        unique: false,
        allowNull: false,
        field: "first_name"
    })
    firstName: string;

    @Column({
        type: DataType.STRING,
        unique: false,
        allowNull: false,
        field: "last_name"
    })
    lastName: string;

    @Column({
        type: DataType.DATE,
        allowNull:false,
        field: "hiring_date"
    })
    hiringDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull:false,
        field: "birth_day"
    })
    birthDay: Date;

    @HasOne(() => User)
    User: User;   
}

