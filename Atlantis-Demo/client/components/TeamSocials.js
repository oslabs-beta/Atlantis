import React from 'react';
import GitHubLogo from '../assets/github.svg';
import NPMLogo from '../assets/npm_light.svg';
import medium from '../assets/medium.svg';
import product_hunt from '../assets/product_hunt.svg';

export default function TeamSocials() {
  return (
    <div className="team-social-container">
      <h3>Atlantis</h3>
      <div className="team-social-icons">
        <a
          href="https://github.com/oslabs-beta/Atlantis"
          target="_blank"
          className="team-social"
          target="_blank"
        >
          <img id="team-github-social" src={GitHubLogo} width="55"></img>
        </a>
        <a
          href="https://www.npmjs.com/package/atlantis-cache"
          target="_blank"
          className="team-social"
        >
          <img id="team-npm-social" src={NPMLogo} width="55"></img>
        </a>
        <a
          href="https://coralfussman.medium.com/atlantis-47639b78d34d"
          target="_blank"
          className="team-social"
        >
          <img id="team-medium-social" src={medium} width="55"></img>
        </a>
        <a
          href="https://www.producthunt.com/posts/atlantis-cache-graphql"
          target="_blank"
          className="team-social"
        >
          <img id="team-medium-social" src={product_hunt} width="55"></img>
        </a>
      </div>
    </div>
  );
}
