const securityssologinusach=(function(){
	var token = "";
	var refreshToken = "";
	const URL_AUTHORIZED = "https://api.dti.usach.cl/api/3B4D/login/authorization";
	const NAME_TOKEN_COOKIE = "token";
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
		  const responseJson = await response.text();
		  return responseJson;
		}
		async function checkAuthorized(){
			token = getCookie(NAME_TOKEN_COOKIE);
			if(token.length > 5){
			const jsonResponse = await request(URL_AUTHORIZED);
				if(jsonResponse === "Autorizado"){
					return 1;
				}
			}
			return 0;
		}
		async function isAuthorized(){
			return await checkAuthorized();
		}

		return{
			isAuthorized: isAuthorized,
		};
})();
