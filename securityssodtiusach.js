var UsachDTISecured =UsachDTISecured||(function(){
	var token = "";
	var refreshToken = "";
	// const BASEURL_AUTHORIZATION = "http://190.215.4.123:8089/api";
	const SSO_URL = "https://sso.dti.usach.cl";
	const BASEURL_AUTHORIZATION = "https://api.dti.usach.cl/api";
	const URL_LOGIN = "/3B4D/login";
	const URL_ROLES = "/3B4D/profile"
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
			var status = 0;
			try {
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
				status = response.status;
				const responseJson = await response.json();
				return {
					status: response.status,
					data: responseJson
				};

			} catch (e) {
				console.log(e);
				console.log(status);
				return {
					status: status,
					data: {}
				};
			}
			// console.log(responseJson);
		}
		async function checkAuthorized(){
			token = getCookie(NAME_TOKEN_COOKIE);
			if(token.length > 5){
			const jsonResponse = await request(`${BASEURL_AUTHORIZATION}${URL_LOGIN}/authorization`);
				if(jsonResponse.data.status === "OK"){
					return 1;
				}
			}
			return 0;
		}
		async function requestNewToken() {
			token = getCookie(NAME_REFRESHTOKEN_COOKIE);
			const jsonResponse = await request(`${BASEURL_AUTHORIZATION}${URL_LOGIN}/refresh-token`);
			if(jsonResponse.data?.token && jsonResponse.data?.refreshToken){
				document.cookie = `token=${jsonResponse.data.token};max-age=604800;Domain=usach.cl;path=/;`;
				document.cookie = `refreshToken=${jsonResponse.data.refreshToken};max-age=604800;Domain=usach.cl;path=/`;
				return 1;
			}
			else {
				return 0;
			}
		}
		async function requestRoles(appCode, location) {
			token = getCookie(NAME_TOKEN_COOKIE);
			const jsonResponse = await request(`${BASEURL_AUTHORIZATION}${URL_ROLES}/apps/${appCode}/roles/permisos`);
			if (jsonResponse.status === 200 && jsonResponse.data.length > 0) {
				//Invitado: ['guest']
				return jsonResponse.data;
			}
			else if (jsonResponse.status === 401) {
				const gotNewToken = await requestNewToken();
				if (gotNewToken) {
					return jsonResponse.data;
				}
				else {
					// window.location.replace(`http://localhost:3000?redirect_url=${location}`);
					window.location.replace(`${SSO_URL}?redirect_url=${location}`);
				}
			}
			else {
				window.location.replace(`${SSO_URL}`);
			}
		}

		async function isAuthorized(){
			return await checkAuthorized();
		}
		async function newToken(){
			return await requestNewToken();
		}
		async function getRoles(appCode, location) {
			return await requestRoles(appCode, location);
		}

		return {
			isAuthorized: isAuthorized,
			newToken: newToken,
			getRoles: getRoles
		};
})();
