/**
 * @typedef {function(response)} xhrSuccessCallback
 * @callback xhrSuccessCallback
 * @param {object} response
 */

 /**
 * @typedef {function(xhr)} xhrFailureCallback
 * @callback xhrFailureCallback
 * @param {XMLHttpRequest} xhr
 */

/**
 * * ProRest constructor
  * @param {string} url - The base URL of the running ProREST instance (including /api)
 */
ProRest = function(url)
{
	this.Url = url;
	this.Token = "Not yet logged in";
	window.ProRest = this;
}

/**
 * Authenticates against the ProREST webservice, the token will be automatically saved for the lifetime of this client instance (on successful login)
 * @param {string} username - The username
 * @param {string} password - The password of the suer
 * @param {int} tokenExpire - Time in minutes till the revieved token expires
 * @param {xhrSuccessCallback} success - The callback function on success
 * @param {xhrFailureCallback} error - The callback function on failure
 */
ProRest.prototype.Login = function(username, password, tokenExpire, success, error)
{
	var data = { };
	data.Username = username;
	data.Password = password;
	data.TokenExpire = tokenExpire;

	this.RequestInternal("/Login", data,
		function(response)
		{
			window.ProRest.Token = response.Token;
			success(response);
		}, error);
}

ProRest.prototype.Logout = function()
{
	var data = { };
	data.Token = this.Token;

	this.RequestInternal("/Logout", data, success, error);
}

/**
 * Sets the given token
 * @param {string} token - The token
 */
ProRest.prototype.SetToken = function(token)
{
	this.Token = token;
}

/**
 * Executes the given stored procedure
 * @param {string} storedProcedureName - The name of the stored procedure 
 * @param {array} parameters A list of StoredProcedureParameters, create them with ProRest.CreateStoredProcedureRequestBody
 * @param {xhrSuccessCallback} success - The callback function on success
 * @param {xhrFailureCallback} error - The callback function on failure
 */
ProRest.prototype.StoredProcedure = function(storedProcedureName, parameters, success, error)
{
	return this.RequestInternal("/StoredProcedure", this.CreateStoredProcedureRequestBody(storedProcedureName, parameters), success, error);
}

/**
 * Internal function to create the StoredProcedureRequestBody
 * @param {string} name - The name of the stored procedure
 * @param {array} parameters A list of StoredProcedureParameters, create them with ProRest.CreateStoredProcedureRequestBody
 */
ProRest.prototype.CreateStoredProcedureRequestBody = function(name, parameters)
{
	var data = { };
	data.StoredProcedure = name;
	data.Parameters = parameters;
	
	return data;
}

/**
 * Function to create a single StoredProcedureRequestParameter
 * @param {string} name - The name of the parameter
 * @param {string} value - The value of the parameter
 * @param {boolean} [isOutput=false] isOutput - Determines wheter this is an output parameter or not
 */
ProRest.prototype.CreateStoredProcedureRequestParameter = function(name, value, isOutput = false)
{
	var data = { };
	data.Name = name;
	data.Value = value;
	data.IsOutput = isOutput;

	return data;
}

/**
 * Internal function to actually send the API request
 * @param {string} relativeApiUrl - The relative API URL, e. g. "/Login"
 * @param {object} requestBody - The request body
 * @param {xhrSuccessCallback} success - The callback function on success
 * @param {xhrFailureCallback} error - The callback function on failure
 */
ProRest.prototype.RequestInternal = function(relativeApiUrl, requestBody, success, error)
{
	var xhr = new XMLHttpRequest();
	var url = this.Url.replace(/\/$/, "") + relativeApiUrl;

	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === XMLHttpRequest.DONE)
		{
			if (xhr.status === 200)
			{
				if (success)
				{
					success(JSON.parse(xhr.responseText));
				}
			}
			else
			{
				if (error)
				{
					error(xhr);
				}
			}
		}
	};

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("ProRest-ApiKey", this.Token);
	xhr.send(JSON.stringify(requestBody));
}
