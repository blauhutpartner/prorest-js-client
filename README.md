# prorest-js-client
A JavaScript client for ProREST, a RESTful web interface for the ERP System ProCoS.

## How to install
Manually download and reference the `ProREST.js` file or use your preferred package manager (recommended, e. g. [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)).

### Usage example
```
yarn add prorest-js-client
```

```html
<!DOCTYPE html>
<html>
	<head>
		...
	</head>
	<body>
		...
		<script src="node_modules/ProREST.js"></script>
	</body>
</html>
```

```js
// Create a new instance
var proRest = new ProRest("https://<YourServer>/api");

// Login by username & password to obtain an access token
proRest.Login("<Username>", "<Password>, null, function(response)
{
	// Login was successful
	// response.Token contains the obtained token
},
function(xhr)
{
	// Login was NOT successful
});

// Or directly use a known access token
proRest.SetToken("<YourToken>");

// Call a stored procedure (with parameters)
var parameters = [];
parameters.push(proRest.CreateStoredProcedureRequestParameter("@Mitarbeiter", "<TheParamValue>"));
proRest.StoredProcedure("procos.ExampleGetDataByMitarbeiter", parameters,
function(response)
{
	// response provides the resultset(s)
},
function(xhr)
{
	// Something went wrong
});
```
