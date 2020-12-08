import { Injectable, Inject } from "@nestjs/common"
import { VACATION_REQUEST_REPOSITORY } from "../../core/constants"
import { VacationRequest } from "./vacationRequest.entity"
import { VacationRequestDto } from "./dto/VacationRequest.dto"
import { VacationStatus } from "./entitties/vacationStatus.entity";
import { Person } from "../person/person.entity";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { BasicValidations } from "./validations/basicValidations";
import { LawValidations } from "./validations/lawValidations";
import dayjs = require("dayjs");


var Holidays = require('date-holidays')

@Injectable()
export class VacationRequestService {

    constructor(
        @Inject(VACATION_REQUEST_REPOSITORY) private readonly vacationRequestRepository: typeof VacationRequest
    ) { }

    async RequestVacation(data: VacationRequestDto): Promise<VacationRequest> {
        const handler = new BasicValidations(this.vacationRequestRepository);
        handler.setNext(new LawValidations());
        var errors = new Array<String>();

        const validations = await handler.handle(data, errors);

        if (!validations) {
            throw new BadRequestException({
                error: errors
            });
        }

        console.log("chegou até aqui")

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

    async getVacationsAccordingUser(personId: string, vacationTimeid: string) {

        const vacations = await this.vacationRequestRepository.findAll({
            include: [
                {
                    model: VacationStatus,
                    as: 'vacationStatus'
                },
                {
                    model: Person,
                    as: 'requestUser'
                },
            ],
            where: {
                requestUserId: personId,
                vacationTimeId: vacationTimeid
            }
        });

        return vacations.map((x) => this.toResponseObject(x));
    }

    async updateRequest(requestToUpdate: string, data: VacationRequestDto) {
        const request = await this.vacationRequestRepository.findOne({ where: { id: requestToUpdate } });

        if (request == null) {
            throw new BadRequestException('Solicitação não encontrada!');
        }

        return await this.vacationRequestRepository.update<VacationRequest>(data, { where: { id: requestToUpdate } });
    }

    async deleteRequest(vacationRequestId: string) {
        return this.vacationRequestRepository.destroy({ where: { id: vacationRequestId } })[0];
    }
}
