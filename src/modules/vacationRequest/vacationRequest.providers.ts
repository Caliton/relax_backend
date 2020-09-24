import { VacationRequest } from "./vacationRequest.entity";
import { VACATION_REQUEST_REPOSITORY } from "../../core/constants";

export const vacationRequestProviders = [{
    provide: VACATION_REQUEST_REPOSITORY,
    useValue: VacationRequest
}]
