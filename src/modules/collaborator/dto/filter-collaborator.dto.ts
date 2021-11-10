import { BaseQueryParametersDto } from 'src/shared/dtos/base-query-parameters.dto';

export class FilterCollaboratorDto extends BaseQueryParametersDto {
  filter: string;
}
