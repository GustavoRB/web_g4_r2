const crypto = require('crypto');
const fs = require('fs');

let Util = function(){
};

Util.prototype.validateEmail = (value) => {
	let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(value);
};

Util.prototype.validateCPNJ = (value) => {
	value = value.replace('.','');
	value = value.replace('.','');
	value = value.replace('.','');
	value = value.replace('-','');
	value = value.replace('/','');
	let cnpj = value;
	let numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
	digitos_iguais = 1;
	if (cnpj.length < 14 && cnpj.length < 15)
		return false;
	for (i = 0; i < cnpj.length - 1; i++)
		if (cnpj.charAt(i) != cnpj.charAt(i + 1))
		{
			digitos_iguais = 0;
			break;
		}
	if (!digitos_iguais)
	{
		tamanho = cnpj.length - 2;
		numeros = cnpj.substring(0,tamanho);
		digitos = cnpj.substring(tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--)
		{
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(0))
			return false;
		tamanho = tamanho + 1;
		numeros = cnpj.substring(0,tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--)
		{
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

		return resultado !== digitos.charAt(1);
	}
	else
		return false;
};

Util.prototype.encrypt = (encrypton_method, senha) => {
	return crypto.createHash(encrypton_method).update(senha).digest('hex');
};

Util.prototype.isArray = (value) => {
	return Array.isArray(value);
};

Util.prototype.isValidId = (value) => {
	return /^[a-fA-F0-9]{24}$/.test(value);
};

Util.prototype.write_buffer = (caminho, buffer)=>{

  return new Promise((resolve, reject)=>{
    fs.writeFile(caminho, buffer, err => {

      if (err) {
        return reject(err);
      }

      resolve(caminho);

    });
  });
};

module.exports = new Util();