export abstract class BaseQueryParametersDto {
  sort: string;

  page: number;

  limit: number;
}

// exemplo de um objeto com as informações de ordenação para me enviar via frontend
// const sort = {
//   name: 'ASC',
//   email: 'DESC',
// };

// const sortString = JSON.stringify(sort);
// sortString => "{\"name\":\"ASC\",\"email\":\"DESC\"}"
