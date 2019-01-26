import React, { Component } from "react";

class UserDetailsInput extends Component {

  render() {
    const STEAM_PROFILE_URL = 'https://steamcommunity.com/id/'
    return (
			<div class="card shadow-sm">
				<div class="card-header">
					<h4>User Details</h4>
				</div>
				<div class="card-body">
					<p class="card-text">
						Input two different users Steam community profile names (or IDs) and press that big blue button!
					</p>
					<p>
						<b>Note! </b>
						Both profiles needs to be public!
					</p>
					<hr />
					<form class="form-validate" novalidate>
						<div class="form-group">
							<label for="user1Input">Profile name or ID for first user</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text">
										{STEAM_PROFILE_URL}
									</span>
								</div>
								<input id="user1Input" type="text" class="form-control form-control-lg"  placeholder="A Steam profile" required />
								<div class="input-group-append">
									<a href="" target="_blank" class="btn btn-outline-secondary profileBtn rounded-right" title="Open profile in Steam">
										<i class="fab fa-steam-square fa-lg"></i>
									</a>
								</div>
								<div class="invalid-feedback">
									<i class="fa fa-times"></i> Please input a valid public Steam Community profile name or ID!
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="user2Input">Profile name or ID for second user</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text" id="urlPrepend2">
                    {STEAM_PROFILE_URL}
                  </span>
								</div>
								<input id="user2Input" type="text" class="form-control form-control-lg"  placeholder="Another Steam profile" aria-describedby="urlPrepend2" required />
								<div class="input-group-append">
									<a href="" target="_blank" class="btn btn-outline-secondary profileBtn rounded-right" title="Open profile in Steam">
										<i class="fab fa-steam-square fa-lg"></i>
									</a>
								</div>
								<div class="invalid-feedback">
									<i class="fa fa-times"></i> Please input a valid public Steam Community profile name or ID!
								</div>
							</div>
						</div>
						<button class="btn btn-primary btn-lg btn-block" type="submit">
							<span>Get shared Steam games!</span>
						</button>
					</form>
				</div>
			</div>
    );
  }
}

export default UserDetailsInput;
