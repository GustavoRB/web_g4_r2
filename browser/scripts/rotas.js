/**
 * Created by Osvaldo/Gustavo on 22/10/15.
 */

function ConfigRotas($routeProvider) {

  this.route = $routeProvider;
  this.listeners = {};

  this.rotas = {};

  this.incluiRota = (tipo_user)=> {

    // this.rotas['/jogoProfessor'] = {
    //   templateUrl: pathprincipal + 'views/jogoProfessor/jogoProfessor.html',
    //   controller: 'jogoprofessorController'
    // };

    this.ligaRota();

  };

  this.ligaRota = ()=> {
    for (let name in this.rotas) {
      this.route.when(name, this.rotas[name]);
    }
  };

  this.setaRota = (msg)=> {

    if (msg.tipo_user != undefined) {
      this.incluiRota(msg.tipo_user);
    }

    for (let name in this.rotas) {
      this.route.when(name, this.rotas[name]);
    }

    SIOM.send_to_browser('rotasetada', msg);
  };

  this.usuariosaiu = ()=> {
    this.destroy();
  };

  this.destroy = ()=> {
    for (let name in this.listeners) {
      SIOM.remove_listener(name, this.listeners[name]);
    }
  };

  this.wiring = ()=> {

    this.route.when('/', {
      templateUrl: '../views/fabricante/fabricante.html',
      controller: 'fabricanteController',
    });

    this.listeners['setarota'] = this.setaRota.bind(this);
    this.listeners['exit'] = this.usuariosaiu.bind(this);

    for (let name in this.listeners) {
      SIOM.on(name, this.listeners[name]);
    }

  };

  this.wiring();
}

app.config(ConfigRotas);