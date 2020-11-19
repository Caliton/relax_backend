import dayjs = require("dayjs");
import { start } from "repl";
import { HolidaysRelax } from "../calendar/holidays";
import { VacationRequestDto } from "../dto/VacationRequest.dto";
import { ValidationHandler } from "./vacationRequest.interface";


/**
 *    As regras das férias CLT, ajustadas em 2017, não permitem que agende dois dias antes de um feriado ou de seu descanso semanal remunerado, ou seja, no domingo
 */
export class LawValidations extends ValidationHandler {

    public handle(request: VacationRequestDto, errors: Array<String>): Boolean {
        console.log("Initialize LawValidation");

        var twoDaysAfterStartDate = dayjs(request.startDate).add(2, 'day');
        var oneDayAfterStartDate = dayjs(request.startDate).add(1, 'day');

        var x = new HolidaysRelax(2020);
        console.log(x.isHoliday(request.startDate));

        console.log(twoDaysAfterStartDate.day());

        if (twoDaysAfterStartDate.day() == 0 || oneDayAfterStartDate.day() == 0) {
            errors.push("Erro! Não é possível iniciar as férias dois dias antes de domingo");
        }

        if (x.isHoliday(twoDaysAfterStartDate.toDate()) || x.isHoliday(oneDayAfterStartDate.toDate())) {
            errors.push("Erro! Não é possível iniciar as férias em dois dias antes de feriado")
        }

        if (errors.length == 0) {
            return super.handle(request, errors);
        }
        else {
            return false;
        }
    }
}
