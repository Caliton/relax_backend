import {Table, Column, Model, DataType, HasOne, HasMany, BeforeCreate, AfterCreate, AfterInit, AfterFind} from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { VacationTime } from '../vacationTime/vacationTime.entity';
import { VacationRequest } from '../vacationRequest/vacationRequest.entity';

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
        type: DataType.STRING,
        allowNull:false,
        field: "registration"
    })
    registration: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull:false,
        field: "hiring_date"
    })
    hiringDate: Date;

    @Column({
        type: DataType.DATEONLY,
        allowNull:false,
        field: "birth_day"
    })
    birthDay: Date;

    @HasOne(() => User)
    User: User;   

    @HasMany(() => VacationTime)
    vacations: VacationTime[];

    @HasMany(() => VacationRequest, 'approval_user')
    vacationsToApproval: VacationRequest[];
    
    @HasMany(() => VacationRequest, 'request_user')
    vacationsRequested: VacationRequest[];

    // @BeforeCreate
    // @AfterFind
    // static parseDate(instance: Person) {
    //   instance.hiringDate = new Date(instance.hiringDate.toString() + 'T00:00:00');
    // }
}
