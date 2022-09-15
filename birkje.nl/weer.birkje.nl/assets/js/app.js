//Eerst de code gewrapped in een functie, zorgt ervoor dat niet alle variabelen en functies in de developer console beschikbaar zijn.
(async function() {
    //API KEY opslaan in een variabel voor later gebruik.
    const API_KEY = "02929e7957";

    //API ENDPOINT opslaan in een variabel voor later gebruik. vervang tijdens een verzoek aan de API "QUERY_STRING" met een plaatsnaam of postcode.
    const API_ENDPOINT = "https://weerlive.nl/api/json-data-10min.php?key=" + API_KEY + "&locatie=QUERY_STRING";
    
    //Functie voor het ophalen van weerinformatie.
    async function requestWeatherInformation(querystring) {
        //vervang met de functie ".replace()" het stukje "QUERY_STRING" met het variabel "querystring".
        const url = API_ENDPOINT.replace("QUERY_STRING", querystring);

        //Verzoek de informatie van de API.
        const response = await fetch(url);

        //Retouneer de opgevraagde informatie.
        return await response.json();
    }

    //Door het forumlier te selecteren, en vervolgens het "submit" event onderscheppen kunnen we zelf bepalen wat er gebeurt met de ingevoerde gegevens.
    const searchform = document.querySelector('form.weather-form');
    searchform.addEventListener('submit', e => {
        e.preventDefault();                                                             //Zorgt ervoor dat de standaard actie wordt tegen gehouden.

        var querystring = searchform.querySelector('input').value;                      //querystring voor het verzoek aan de API opslaan in een variabel voor later gebruik.
        requestWeatherInformation(querystring).then(result => {                         //Weersinformatie opvragen met de functie "requestWeatherInformation". Met .then() wachten we op het antwoord van de functie.
            result = result.liveweer[0];                                                //Filter de juiste weersinformatie uit de API.
            
            //Ik heb doormiddel van CSS nog wat animaties toegevoegd. Dat we eerst de bestaande weersinformatie verbergen, en 300ms (0,3s) wachten voordat we de informatie verwerken, is vanwege de transitie tussen weersinformatie.

            document.querySelector('.weather-status').classList.add('hide');            //Weersinformatie verbergen. 
            setTimeout(() => {                                                          //300ms wachten tot het verwerken van de weersinformatie.
                document.querySelectorAll('[weather-info]').forEach(element => {        //Hiermee selecteren we alle element met een weather-info attribuut, voorbeeld: <element weather-info="xxxxx"></element>. "xxxxx" is hierbij een eigenschap van de weersinformatie die we in dat element in moeten vullen.
                    var requested = element.getAttribute('weather-info');               //Met ".getAttribute('weather-info')" kunnen we het eigenschap, in het voorbeeld hierboven "xxxxx", ophalen uit het attribuut "weather-info".
                    element.innerText = result[requested];                              //Als laatste vullen we de informatie in.
                });

                document.querySelector('.weather-status').classList.remove('hide');     //We maken de weersinformatie weer zichtbaar.
            }, 300);

            //Ik laat per type weer (zonnig, bewolkt of regen) de achtergrond veranderen. Het type weer kun je vinden in de eigenschap "samenv". Kijk op https://weerlive.nl/delen.php, onder parameters, voor de type weerseigenschappen.

            if (result.samenv.toLowerCase() == 'onbewolkt') {                                                       //Is het onbewolkt, dan is het zonnig
                document.body.style.backgroundImage = "url('assets/img/scene-sunny.jpg')";
            } else if (result.samenv.includes('wolk')) {                                                            //Bevat "samenv" het woord "wolk", is het bewolkt.
                document.body.style.backgroundImage = "url('assets/img/scene-cloudy.jpg')";
            } else if (result.samenv.includes('regen')) {                                                           //Bevat "samenv" het woord "regen", regent het.
                document.body.style.backgroundImage = "url('assets/img/scene-rain.jpg')";
            } else {
                document.body.style.backgroundImage = null;                                                         //Is de "samenv" anders dan verwacht, dan stellen we de standaard achtergrond weer in.
            }
        });
    })
})();