export class CollaboratorBulkDto {
  readonly name: string;
  readonly register: string;
  readonly hiringDate: string;
  readonly birthDay: string;
  readonly daysEnjoyed: number;
  readonly periodOk: number;
}

export class BulkCollaboratorsDto {
  readonly data: CollaboratorBulkDto[];
}
