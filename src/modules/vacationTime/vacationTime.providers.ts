import { VACATION_TIME_REPOSITORY } from "../../core/constants";
import { VacationTime } from "./vacationTime.entity";

export const vacationTimeProviders = [{
    provide: VACATION_TIME_REPOSITORY,
    useValue: VacationTime
}]
