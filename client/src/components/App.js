import React, { Component } from "react";
import "./App.css"
import UserDetailsInput from "./UserDetailsInput"

class App extends Component {
  render() {
    return (
      <div>
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    			<a class="navbar-brand" href="#">
    				<i class="fab fa-steam"></i>
    				Steam with Friends
    			</a>
    			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
    				<span class="navbar-toggler-icon"></span>
    			</button>
    			<div class="collapse navbar-collapse" id="navbarCollapse">
    				<ul class="navbar-nav mr-auto">
    					<li class="nav-item active">
    						<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
    					</li>
    				</ul>
    			</div>
    			<span class="navbar-text">
    				<a href="https://github.com/rattmuffen/Steam-with-Friends" target="_blank" title="Open Steam with Friends in GitHub">
    					<i class="fab fa-github fa-lg"></i>
    				</a>
    			</span>
    		</nav>
        <main id="mainContainer" role="main" class="container">
          <UserDetailsInput />
        </main>
      </div>
    );
  }
}

export default App;
