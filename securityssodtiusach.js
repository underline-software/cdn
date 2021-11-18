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
				if(jsonResponse === "Autorizado"){
					return 1;
				}
			}
			return 0;
		}
		async function requestNewToken() {
			token = getCookie(NAME_REFRESHTOKEN_COOKIE);
			const jsonResponse = await request(`${URL_AUTHORIZATION}/refresh-token`);
			console.log(jsonResponse);
			document.cookie = `token=${jsonResponse.token};max-age=604800;`;
			document.cookie = `refreshToken=${jsonResponse.refreshToken};max-age=604800;`;
		}

		async function isAuthorized(){
			return await checkAuthorized();
		}
		async function newToken(){
			return await requestNewToken();
		}

		return{
			isAuthorized: isAuthorized,
			newToken: newToken
		};
})();
