var UsachDTISecured =UsachDTISecured||(function(){
	var token = "";
	var refreshToken = "";
	const URL_AUTHORIZATION = "https://api.dti.usach.cl/api/3B4D/login";
	const NAME_TOKEN_COOKIE = "token";
	const NAME_REFRESHTOKEN_COOKIE = "refreshToken";
		function getCookie(cname){
			let name = cname + "=";
			  let ca = document.cookie.split(';');
			  for(let i = 0; i < ca.length; i++) {
			    let c = ca[i];
			    while (c.charAt(0) == ' ') {
			      c = c.substring(1);
			    }
			    if (c.indexOf(name) == 0) {
			      return c.substring(name.length, c.length);
			    }
			  }
			  return "";
		}
		async function request(url = '') {
		  const response = await fetch(url, {
		    method: 'GET',
		    mode: 'cors',
		    cache: 'no-cache',
		    credentials: 'same-origin',
		    headers: {
		      'Content-Type': 'application/json',
		      'Authorization': "Bearer " + token
		    },
		    redirect: 'follow',
		    referrerPolicy: 'no-referrer'
		  });
		  const responseJson = await response.json();
		  return responseJson;
		}
		async function checkAuthorized(){
			token = getCookie(NAME_TOKEN_COOKIE);
			if(token.length > 5){
			const jsonResponse = await request(`${URL_AUTHORIZATION}/authorization`);
				if(jsonResponse.status === "OK"){
					return 1;
				}
			}
			return 0;
		}
		async function requestNewToken() {
			token = getCookie(NAME_REFRESHTOKEN_COOKIE);
			const jsonResponse = await request(`${URL_AUTHORIZATION}/refresh-token`);
			console.log(jsonResponse);
			if(jsonResponse.token && jsonResponse.refreshToken){
				document.cookie = `token=${jsonResponse.token};max-age=604800;`;
				document.cookie = `refreshToken=${jsonResponse.refreshToken};max-age=604800;`;
				return 1;
			}
			else {
				return 0;
			}
		}
		async function requestRoles(appCode) {
			token = getCookie(NAME_TOKEN_COOKIE);
			const jsonResponse = await request(`${URL_AUTHORIZATION}/roles/${appCode}`);
			//Si da error se debe botar de la app, sino debe tener al menos un elemento en el arreglo.
			return jsonResponse;
		}

		async function isAuthorized(){
			return await checkAuthorized();
		}
		async function newToken(){
			return await requestNewToken();
		}
		async function getRoles(appCode) {
			return await requestRoles(appCode);
		}

		return {
			isAuthorized: isAuthorized,
			newToken: newToken,
			getRoles: getRoles
		};
})();
