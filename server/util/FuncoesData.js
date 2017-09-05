/**
 * Created by Lucas on 12/07/2017.
 *
 * Classe com methodos estáticos úteis para as regras de negócio que envolvem
 * datas e períodos.
 */

const Constants = require('./constants.json').CONSTANTES_DATA;

class FuncoesData {
  /**
   * Created by Lucas
   * Recebe uma data HH:MM:SS:mmmm e retorna seus milliseconds
   * @param data
   * @returns {number}
   */
  static transformDataIntoMillis(data) {
    let hours_into_millis = ((data.getHours() * 60) * 60) * 1000;
    let minutes_into_millis = (data.getMinutes() * 60) * 1000;
    let seconds_into_millis = data.getSeconds() * 1000;
    return hours_into_millis + minutes_into_millis + seconds_into_millis +
      data.getMilliseconds();
  }

  /**
   * Created by Lucas on 12/07/2017
   *
   * Retorna a diferenca em milliseconds do horario atual e do horario de
   * fechamento da semana, que está definido nas contants.
   *
   * @returns {number}
   */
  static getDiferencaHorarioAtualEFechamento() {
    let horario_atual = FuncoesData.transformDataIntoMillis(new Date());
    let milliseconds_fechamento = Constants.MILLISECONDS_FECHAMENTO_ATUAL;
    return milliseconds_fechamento - horario_atual;
  }

  /**
   * Created by OLDS on 13/07/2017
   *
   * Retorna o dia da próxima sexta. OBS: Retornará o dia do mês seguinte caso
   * a próxima sexta seja no mês seguinte.
   *
   * @returns {number}
   */
  static getDataProximaSexta(data_recebida, dia_ultima_sexta) {
    let data_modificavel = new Date(data_recebida.getFullYear(),
      data_recebida.getMonth(), data_recebida.getDate());
    if (data_modificavel.getDate() > dia_ultima_sexta) {
      this.setProximoMes(data_modificavel);
    }
    while (data_modificavel.getDay() !== Constants.NUMERO_SEXTA_NA_SEMANA) {
      data_modificavel.setDate(data_modificavel.getDate() + 1);
    }
    return data_modificavel;
  }

  /**
   * Created by OLDS on 14/07/2017
   * Retorna numero do dia do mes da ultima sexta
   * OBS: já faz get Month + 1 para leitura humana
   * @param ano
   * @param mes
   * @returns {number}
   */
  static getUltimaSexta(ano, mes) {
    let data_requisitada = new Date(ano, mes + 1, 0);
    while (data_requisitada.getDay() !== Constants.NUMERO_SEXTA_NA_SEMANA) {
      data_requisitada.setDate(data_requisitada.getDate() - 1);
    }
    return data_requisitada.getDate();
  }

  /**
   * Created by OLDS on 14/07/2017
   * retorna quantidade de dias para a proxima sexta. OBS: funciona também caso
   * a próxima sexta seja no mês seguinte
   * @param data_recebida
   */
  static getQuantidadeDiasProximaSexta(data_recebida) {
    let dia_proxima_sexta = this.getDataProximaSexta(data_recebida,
      this.getUltimaSexta(data_recebida.getFullYear(), data_recebida.getMonth())).getDate();
    if (data_recebida.getDate() > dia_proxima_sexta) {
      let ultimo_dia_do_mes = new Date(data_recebida.getFullYear(),
        data_recebida.getMonth() + 1, 0);
      ultimo_dia_do_mes = ultimo_dia_do_mes.getDate();
      return ultimo_dia_do_mes - data_recebida.getDate() + dia_proxima_sexta;
    } else {
      return dia_proxima_sexta - data_recebida.getDate();
    }
  }

  /**
   * Created by Lucas on 13/07/2017
   *
   * Utiliza a fórmula para calcular a quantidade de semanas, favor não chamar
   * esse método fora desta classe.
   * @param dia_proxima_sexta
   * @param dia_primeira_sexta
   * @param diferenca_datas
   * @private
   */
  static _calculaQuantidaDeSemanas(dia_proxima_sexta, dia_primeira_sexta, diferenca_datas) {
    return Math.floor(1 + (dia_proxima_sexta -
      dia_primeira_sexta) / 7);
    // retorno = diferenca_datas < 0 ? retorno + 1 : retorno;
  }

  /**
   * Created by OLDS on 14/07/2017
   * Retorna o dia da primeira sexta da data recebida
   * @param data_recebida
   * @returns {number}
   */
  static getDiaPrimeiraSexta(data_recebida) {
    let data_modificavel = new Date(data_recebida.getFullYear(),
      data_recebida.getMonth(), data_recebida.getDate());
    data_modificavel.setDate(1);
    while (data_modificavel.getDay() !== Constants.NUMERO_SEXTA_NA_SEMANA) {
      data_modificavel.setDate(data_modificavel.getDate() + 1);
    }
    return data_modificavel.getDate();
  }

  /**
   * Created by Lucas on 13/07/2017
   *
   * Retorna a quantidade de semanas com base no dia da primeira sexta do mes
   * e no dia da próxima sexta
   *
   * @param dia_proxima_sexta
   * @param dia_primeira_sexta
   * @returns {number}
   */
  static getTotalDeSemanasExistentesMesAtual(dia_proxima_sexta, dia_primeira_sexta) {
    let dia_do_mes_atual = new Date().getDate();
    let diferenca_datas = dia_do_mes_atual - dia_proxima_sexta;
    return this._calculaQuantidaDeSemanas(dia_proxima_sexta,
      dia_primeira_sexta, diferenca_datas);
  }

  static getMesAnterior(mes) {
    return mes === 1 ? 12 : mes - 1;
  }

  /**
   * Created by Thiago e Lucas on 01/08/2017
   *
   * Seta o próximo mês, inclusive em trocas de anos.
   *
   * @param data_modificavel
   */
  static setProximoMes(data_modificavel) {
    data_modificavel.setDate(1);
    if(data_modificavel.getMonth() === 11){
      data_modificavel.setMonth(0);
      data_modificavel.setFullYear(data_modificavel.getFullYear() + 1);
    } else {
      data_modificavel.setMonth(data_modificavel.getMonth() + 1);
    }
  }

  /**
   * Created by Thiago and Lucas on 02/08/2017
   *
   * Retorna semana atual.
   *
   * @param data_atual
   * @returns {number}
   */
  static getSemanaAtual(data_atual) {
    let dia_ultima_sexta = FuncoesData.getUltimaSexta(data_atual.getFullYear(),
      data_atual.getMonth());
    let dia_primeira_sexta = FuncoesData.getDiaPrimeiraSexta(data_atual);
    let dia_proxima_sexta = FuncoesData.getDataProximaSexta(data_atual, dia_ultima_sexta).getDate();
    return FuncoesData.getTotalDeSemanasExistentesMesAtual(dia_proxima_sexta, dia_primeira_sexta);
  }

  /**
   * Created by Lucas on 10/07/2017
   *
   * retorna o total de semanas do mês anterior
   */
  static getTotalDeSemanasMesAnterior(ultimo_dia_do_mes, dia_primeira_sexta) {
    return Math.floor(1 + (ultimo_dia_do_mes -
      dia_primeira_sexta) / 7);
  }

}


module.exports = FuncoesData;