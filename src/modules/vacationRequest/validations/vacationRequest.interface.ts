import { BadRequestException } from "@nestjs/common";
import dayjs = require("dayjs");
import { VacationRequestDto } from "../dto/VacationRequest.dto";

export abstract class ValidationHandler {
    private nextHandler: ValidationHandler;

    public setNext(handler: ValidationHandler): ValidationHandler {
        this.nextHandler = handler;
        return handler;
    }

    public handle(request: VacationRequestDto, errors: Array<String>): Boolean {
        if (this.nextHandler) {
            return this.nextHandler.handle(request, errors);
        }

        if (errors.length != 0) {
            return false
        }

        return true;
    }
}


