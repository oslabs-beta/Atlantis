import React from "react";
import GitHubLogo from '../assets/github.svg';
import NPMLogo from '../assets/npm_light.svg'


export default function TeamSocials() {
    return (
        <div className="team-social-container">
          <h3>Atlantis</h3>
            <div className="team-social-icons">
              <a href="https://github.com/oslabs-beta/Atlantis"
                className="team-social" target="_blank">
                    <img id='team-github-social' src={GitHubLogo} width="55"></img>
              </a>
              <a href="https://www.npmjs.com/package/atlantis-cache"
                className="team-social">
                  <img id='team-npm-social' src={NPMLogo} width="55"></img>
              </a>
            </div>
        </div>
    )
}