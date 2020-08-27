import {Table, Column, Model, DataType, HasOne, HasMany} from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { VacationTime } from '../vacationTime/vacationTime.entity';

@Table
export class Person extends Model<Person> {
    @Column({
        type: DataType.STRING,
        unique: false,
        allowNull: false,
        field: "name"
    })
    name: string;

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

    @HasMany(() => VacationTime)
    vacations: VacationTime[]
}

