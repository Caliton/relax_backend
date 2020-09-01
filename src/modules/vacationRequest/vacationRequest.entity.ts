import { Model } from "sequelize-typescript";
import { Table, ForeignKey, Column, BelongsTo, DataType } from "sequelize-typescript";
import { Person } from "../person/person.entity";
import { VacationTime } from "../vacationTime/vacationTime.entity";
import { VacationStatus } from "./entitties/vacationStatus.entity";

@Table
export class VacationRequest extends Model<VacationRequest>{

    @ForeignKey(() => VacationTime)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'vacation_time'
    })
    vacationTimeId: number;

    @BelongsTo(() => VacationTime)
    vacationTime: VacationTime;
    
    @ForeignKey(() => Person)
    @Column({
        type:DataType.INTEGER,
        allowNull: false,
        field: 'request_user'
    })
    requestUserId: number;

    @BelongsTo(() => Person)
    requestUser: Person;

    @ForeignKey(() => Person)
    @Column({
        type:DataType.INTEGER,
        allowNull: true,
        field: 'approval_user'
    })
    approvalUserId: number;

    @BelongsTo(() => Person)
    approvalUser: Person;


    @ForeignKey(() => VacationStatus)
    @Column({
        type:DataType.INTEGER,
        allowNull: false,
        field: 'vacation_status',
        defaultValue: 1
    })
    vacationStatusId: number;

    @BelongsTo(() => VacationStatus)
    vacationStatus: VacationStatus;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        field: 'start_date'
    })
    startDate: Date;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        field: 'final_date'
    })
    finalDate: Date;
}
