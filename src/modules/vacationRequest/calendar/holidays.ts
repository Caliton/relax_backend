import moment from 'moment';

export class HolidaysRelax {
  year: number;
  month: string;
  easter: any;
  corpusChristi: any;
  carnival: any;
  holidays: { date: any; description: string }[];

  constructor(year: number) {
    this.year = year;
    this.calculateMovelHolidays();
    this.fillHolidays();
  }

  fillHolidays() {
    this.holidays = [
      {
        date: moment(this.easter).add(-2, 'd'),
        description:
          'Páscoa ou Domingo da Ressurreição é uma festividade religiosa e um feriado que celebra a ressurreição de Jesus ocorrida três dias depois da sua crucificação no Calvário, conforme o relato do Novo Testamento.',
      },
      {
        date: this.corpusChristi,
        description:
          'Corpus Christi (expressão latina que significa Corpo de Cristo), generalizada em Portugal como Corpo de Deus é um evento baseado em tradições católicas realizado na quinta-feira seguinte ao domingo da Santíssima Trindade, que, por sua vez, acontece no domingo seguinte ao de Pentecostes.',
      },
      {
        date: this.carnival,
        description:
          'Carnaval é um festival do cristianismo ocidental que ocorre antes da estação litúrgica da Quaresma. Os principais eventos ocorrem tipicamente durante fevereiro ou início de março, durante o período historicamente conhecido como Tempo da Septuagésima (ou pré-quaresma).',
      },
      {
        date: moment(`${String(this.year)}-01-01`),
        description:
          'O Dia da Fraternidade Universal ou Dia da Confraternização Universal é um feriado nacional no Brasil, comemorado no dia 1 de janeiro. Foi instituído por lei em 1935, por Getúlio Vargas.',
      },
      {
        date: moment(`${String(this.year)}-04-21`),
        description:
          'Joaquim José da Silva Xavier, o Tiradentes, foi um dentista, tropeiro, minerador, comerciante, militar e ativista político que atuou no Brasil. O dia de sua execução, 21 de abril, é feriado nacional.',
      },
      {
        date: moment(`${String(this.year)}-05-01`),
        description:
          'O Dia do Trabalhador, Dia do Trabalho ou Dia Internacional dos Trabalhadores é celebrado anualmente no dia 1º de maio em numerosos países do mundo, sendo feriado no Brasil, em Portugal, Angola, Moçambique e outros países.',
      },
      {
        date: moment(`${String(this.year)}-09-07`),
        description:
          'Independência do Brasil é um processo que se estende de 1821 a 1825 e coloca em violenta oposição o Reino do Brasil e o Reino de Portugal, dentro do Reino Unido de Portugal, Brasil e Algarves.',
      },
      {
        date: moment(`${String(this.year)}-10-12`),
        description:
          'Nossa Senhora da Conceição Aparecida, popularmente chamada de Nossa Senhora Aparecida, é a padroeira do Brasil. Sua festa litúrgica é celebrada em 12 de outubro, um feriado nacional no Brasil desde 1980.',
      },
      {
        date: moment(`${String(this.year)}-11-02`),
        description:
          'Dia dos Fiéis Defuntos ou Dia de Finados (conhecido ainda como Dia dos Mortos no México) é celebrado pela Igreja Católica no dia 2 de novembro.',
      },
      {
        date: moment(`${String(this.year)}-11-15`),
        description:
          'A Proclamação da República Brasileira foi um levante político-militar ocorrido em 15 de novembro de 1889 que instaurou a forma republicana federativa presidencialista do governo no Brasil, derrubando a monarquia constitucional parlamentarista do Império do Brasil e, por conseguinte, pondo fim à soberania do imperador D. Pedro II. Foi, então, proclamada a República do Brasil.',
      },
      {
        date: moment(`${String(this.year)}-12-25`),
        description:
          'Natal ou Dia de Natal é um feriado e festival religioso cristão comemorado anualmente em 25 de dezembro. A data é o centro das festas de fim de ano e da temporada de férias, sendo, no cristianismo, o marco inicial do Ciclo do Natal, que dura doze dias.',
      },
    ].concat(this.getUberlandiaHolidays());
  }

  private calculateMovelHolidays() {
    this.easter = this.calculateEaster();
    this.corpusChristi = this.calculateCorpusChristi();
    this.carnival = this.calculateCarnival();
  }

  private calculateCarnival(): any {
    return this.easter.clone().add(-47, 'd');
  }

  private calculateCorpusChristi(): any {
    return this.easter.clone().add(60, 'd');
  }

  private calculateEaster() {
    const C = Math.floor(this.year / 100);
    const N = this.year - 19 * Math.floor(this.year / 19);
    const K = Math.floor((C - 17) / 25);
    let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
    I = I - 30 * Math.floor(I / 30);
    I =
      I -
      Math.floor(I / 28) *
        (1 -
          Math.floor(I / 28) *
            Math.floor(29 / (I + 1)) *
            Math.floor((21 - N) / 11));
    let J =
      this.year + Math.floor(this.year / 4) + I + 2 - C + Math.floor(C / 4);
    J = J - 7 * Math.floor(J / 7);
    const L = I - J;
    const M = 3 + Math.floor((L + 40) / 44);
    const D = L + 28 - 31 * Math.floor(M / 4);
    const month = M < 10 ? '0' + M : M;
    const day = D < 10 ? '0' + D : D;
    const easterDate = this.year + '-' + month + '-' + day;
    return moment(easterDate);
  }

  public getHolidays() {
    return this.holidays.sort(function (a, b) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      else return 0;
    });
  }

  private getUberlandiaHolidays() {
    return [
      {
        date: moment(`${String(this.year)}-08-15`),
        description: 'Nossa Senhora da Abadia',
      },
      {
        date: moment(`${String(this.year)}-08-31`),
        description: 'Aniversário de Uberlândia',
      },
    ];
  }

  public isHoliday(date: Date): boolean {
    const momentDate = moment(date);
    if (!momentDate.isValid()) {
      return false;
    }
    return (
      this.holidays.filter((x) => x.date.isSame(momentDate, 'day')).length > 0
    );
  }
}
