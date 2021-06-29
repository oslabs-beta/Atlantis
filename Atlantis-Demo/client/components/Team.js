import React from 'react';
import GitHubLogo from '../assets/github.svg';
import LinkedInLogo from '../assets/linkedin.svg';
import Coral from '../assets/Coral_v.2.png';
import Sett from '../assets/Sett_v.2.png';
import Erik from '../assets/Erik_v.2.png';
import Easy from '../assets/Erik_v.png';

function Team() {
  return (
    <div id="team">
      <div className="social">
        <div className="member-cards">
          <div className="personal">
            <h3>Coral Fussman</h3>
            <img src={Coral} />
            <div className="links">
              <a href="https://github.com/coralfussman" target="_blank">
                <img id="team-logo-icon" src={GitHubLogo} />
              </a>
              <a
                href="https://www.linkedin.com/in/coral-fussman-21721538/"
                target="_blank"
              >
                <img id="team-logo-icon" src={LinkedInLogo} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="social">
        <div className="member-cards">
          <div className="personal">
            <h3>Sett Hein</h3>
            <img src={Sett} />
            <div className="links">
              <a href="https://github.com/settnaing199" target="_blank">
                <img id="team-logo-icon" src={GitHubLogo} />
              </a>
              <a href="https://www.linkedin.com/in/sett-hein/" target="_blank">
                <img id="team-logo-icon" src={LinkedInLogo} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="social">
        <div className="member-cards">
          <div className="personal">
            <h3 id="erikM">Erik Matevosyan</h3>
            <img src={Erik} />
            <div className="links">
              <a href="https://github.com/erik-matevosyan" target="_blank">
                <img id="team-logo-icon" src={GitHubLogo} />
              </a>
              <a
                href="https://www.linkedin.com/in/erik-matevosyan/"
                target="_blank"
              >
                <img id="team-logo-icon" src={LinkedInLogo} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="social">
        <div className="member-cards">
          <div className="personal">
            <h3>Erik Rogel</h3>
            <img src={Easy} />
            <div className="links">
              <a href="https://github.com/erikjrogel" target="_blank">
                <img id="team-logo-icon" src={GitHubLogo} />
              </a>
              <a href="https://www.linkedin.com/in/erikjrogel/" target="_blank">
                <img id="team-logo-icon" src={LinkedInLogo} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
