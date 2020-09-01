import { Injectable, Inject } from "@nestjs/common"
import { VACATION_REQUEST_REPOSITORY } from "../../core/constants"
import { VacationRequest } from "./vacationRequest.entity"
import { VacationRequestDto } from "./dto/VacationRequest.dto"
import { VacationStatus } from "./entitties/vacationStatus.entity";

@Injectable()
export class VacationRequestService{

    constructor(
        @Inject(VACATION_REQUEST_REPOSITORY) private readonly vacationRequestRepository: typeof VacationRequest
        ) { }

    async RequestVacation(data: VacationRequestDto) {
        //TODO: Validate how many days have requested. The requested days must not bet greater than the days allowed into vacation times.

        try{
            return await this.vacationRequestRepository.create<VacationRequest>(data);
        } catch(e){
            console.log(e);
        }
    }


    async getAllRequests() : Promise<VacationRequest[]>{
        return await this.vacationRequestRepository.findAll({
            include: [
                {
                    model: VacationStatus, 
                    as: 'vacationStatus'
                }
            ]
        });
    }
}
