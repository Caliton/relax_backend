import dayjs = require("dayjs");
import { VacationRequestDto } from "../dto/VacationRequest.dto";
import { VacationRequest } from "../vacationRequest.entity";
import { ValidationHandler } from "./vacationRequest.interface";


/* Represent:
    - As férias podem ser divididas em até três períodos de 10 dias. Não é permitido período inferior a 10 dias."
*/

export class BasicValidations extends ValidationHandler {

    constructor(private readonly vacationRequestRepository: typeof VacationRequest) {
        super();
    }

    public handle(request: VacationRequestDto, errors: Array<String>): Boolean {
        console.log("Initialize BasicValidations");

        if (!this.performDaysValidation(request, errors)) {
            return false;
        }

        return super.handle(request, errors);
    }

    private performDaysValidation(request: VacationRequestDto, errors: Array<String>) {

        //TODO: Não pode começar férias no passado neh?
        var diffMiliSec = dayjs(request.finalDate).diff(dayjs(request.startDate));
        var diffInDays = (diffMiliSec / (1000 * 60 * 60 * 24) + 1);

        if (diffInDays > 30) {
            errors.push('Erro! Você deve solicitar no máximo 30 dias');
        }

        if (diffInDays < 10) {
            errors.push('Erro! Você deve solicitar pelo menos 10 dias de férias!');
        }

        this.getDaysEnjoyed(request.vacationTimeId).then((value) => { if (!value) { errors.push("Erro! Você não pode solicitar mais de 30 dias de férias!") } })

        return errors.length == 0;
    }

    private async getDaysEnjoyed(vacationTime: number): Promise<number> {
        const requests = await this.vacationRequestRepository.findAll(
            {
                where:
                {
                    vacationTimeId: vacationTime
                }
            }
        );

        const daysMilisec = requests.reduce((acc, vacation) => {
            return dayjs(vacation.finalDate).diff(dayjs(vacation.startDate)) + acc
        }, 0);

        return daysMilisec / (1000 * 60 * 60 * 24) + 1;
    }
}
