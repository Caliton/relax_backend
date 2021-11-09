export class CollaboratorBulkDto {
  readonly name: string;
  readonly register: string;
  readonly hiringDate: string;
  readonly birthDay: string;
}

export class BulkCollaboratorsDto {
  readonly data: CollaboratorBulkDto[];
}
