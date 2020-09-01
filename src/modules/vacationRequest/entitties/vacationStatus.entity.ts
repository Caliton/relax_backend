import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { VacationRequest } from "../vacationRequest.entity";

@Table
export class VacationStatus extends Model<VacationStatus>{
    @Column({
        type: DataType.STRING(100), 
        field: 'description',
        allowNull: false
    })
    description: string;

    @HasMany(() => VacationRequest)
    vacationsRequest: VacationRequest[]
}
