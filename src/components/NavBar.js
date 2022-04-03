 import Identicon from "identicon.js";
import React, { Component } from "react";

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <span
          className="navbar-brand col-sm-3 col-md-2 mr-0 text-light"          
          target="_blank"
          rel="noopener noreferrer"
        >
          Exchange Platform
        </span>
        <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text-light">
                    <small id="account">
                        { this.props.account }
                    </small>
                </small>
                {
                this.props.account 
                // eslint-disable-next-line jsx-a11y/alt-text
                ? <img 
                className="ml-2"
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                />
                :
                <span></span>
            }
            </li>

            
        </ul>        
      </nav>
    );
  }
}

export default NavBar;
