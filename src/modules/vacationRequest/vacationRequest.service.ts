import { Injectable, Inject } from "@nestjs/common"
import { VACATION_REQUEST_REPOSITORY } from "../../core/constants"
import { VacationRequest } from "./vacationRequest.entity"
import { VacationRequestDto } from "./dto/VacationRequest.dto"
import { VacationStatus } from "./entitties/vacationStatus.entity";
import { Person } from "../person/person.entity";
import dayjs = require("dayjs");
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { ValidationHandler } from "./validations/vacationRequest.interface";
import { BasicValidations } from "./validations/basicValidations";
import { LawValidations } from "./validations/lawValidations";
import { HolidaysRelax } from "./calendar/holidays";


var Holidays = require('date-holidays')

@Injectable()
export class VacationRequestService {

    constructor(
        @Inject(VACATION_REQUEST_REPOSITORY) private readonly vacationRequestRepository: typeof VacationRequest
    ) { }

    async RequestVacation(data: VacationRequestDto) {
        //TODO: Validate how many days have requested. The requested days must not bet greater than the days allowed into vacation times.

        // var hd = new Holidays();
        // hd.init('BR', 'MG');
        // console.log(hd.getHolidays(2020).filter(x => x.type == 'public'));

        const handler = new BasicValidations(this.vacationRequestRepository);
        handler.setNext(new LawValidations());
        var errors = new Array<String>();


        // console.log(x.getHolidays());
        if (!handler.handle(data, errors)) {
            throw new BadRequestException({
                error: errors
            });
        }

        try {
            return await this.vacationRequestRepository.create<VacationRequest>(data);
        } catch (e) {
            console.log(e);
        }
    }


    async getAllRequests(): Promise<VacationRequest[]> {
        const vacationRequests = await this.vacationRequestRepository.findAll({
            include: [
                {
                    model: VacationStatus,
                    as: 'vacationStatus'
                },
                {
                    model: Person,
                    as: 'requestUser'
                }
            ]
        });

        return vacationRequests.map((x) => this.toResponseObject(x));
    }

    private toResponseObject(x: VacationRequest): any {
        const newObject = {
            id: x.id,
            person: x.requestUser,
            startDate: x.startDate,
            finalDate: x.finalDate,
            days: this.calcDiffInDays(x.finalDate, x.startDate) + 1,
            vacationStatus: x.vacationStatus
        }
        return newObject;
    }


    private calcDiffInDays(endDate: Date, startDate: Date): number {
        var diff = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        return diffDays;
    }
}
