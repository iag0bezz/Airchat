import React, { Component } from 'react';

export default class Register extends Component {

  render() {

    return (
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <br />

                <form onSubmit={this.props.perform}>
                    <input type="text" id="login" className="fadeIn second" name="username" placeholder="Seu nome de usuário" />
                    <input type="password" id="password" className="fadeIn third" name="password" placeholder="Sua palavra passe secreta" />
                    <input type="submit" className="fadeIn fourth" value="Registrar" />
                </form>

                <div id="formFooter">
                    <a className="underlineHover" href="#" onClick={this.props.change}>Autenticar</a>
                </div>

            </div>
        </div>
    );
  }

}