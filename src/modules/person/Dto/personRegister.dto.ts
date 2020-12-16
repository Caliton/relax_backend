export class PersonRegisterDto {
    readonly name: string;
    readonly registration: string;
    readonly hiringDate : Date;
    readonly birthDay: Date;    
}

export class BulkPersonDto {
    readonly data: PersonRegisterDto[];
}