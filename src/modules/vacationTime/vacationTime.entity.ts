import { Model } from "sequelize-typescript";
import { Table, ForeignKey, Column, BelongsTo, DataType } from "sequelize-typescript";
import { Person } from "../person/person.entity";

@Table
export class VacationTime extends Model<VacationTime> {
    @ForeignKey(() => Person)
    @Column({
            type: DataType.INTEGER
        }
    )
    personId: number;

    @BelongsTo(() => Person)
    person: Person;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "days_allowed"
    })
    daysAllowed: number;

    @Column({
        type: DataType.DATE,
        allowNull:false,
        field: "vacation_date"
    })
    vacationDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "limit_date"
    })
    limitDate: Date;
}
