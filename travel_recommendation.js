const btnSearch = document.getElementById('btnSearch');
const btnclear = document.getElementById('btnclear');

function resetForm() {
    const input = document.getElementById("destinationInput");
    if (input) input.value = "";
    const resultDiv = document.getElementById("result");
    if (resultDiv) resultDiv.innerHTML = "";
}

if (btnclear) {
    btnclear.addEventListener("click", resetForm);
}

function searchDestination() {
    const inputEl = document.getElementById('destinationInput');
    if (!inputEl) return;
    const input = inputEl.value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;
    resultDiv.innerHTML = '';

    if (!input) {
        resultDiv.innerHTML = '<p style="color: white; padding: 10px;">Please enter a search term.</p>';
        return;
    }

    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {
        let results = [];

        // Check beach / beaches
        if (input === 'beach' || input === 'beaches' || 'beaches'.includes(input)) {
            results = data.beaches || [];
        } 
        // Check temple / temples
        else if (input === 'temple' || input === 'temples' || 'temples'.includes(input)) {
            results = data.temples || [];
        } 
        // Check country / countries keyword
        else if (input === 'country' || input === 'countries') {
            // Return at least two different countries' cities
            data.countries.forEach(country => {
                if (country.cities && country.cities.length > 0) {
                    results.push(country.cities[0]); // One representative city per country
                }
            });
        } 
        else {
            // Try matching specific country name
            const matchingCountry = data.countries.find(c => c.name.toLowerCase().includes(input));
            if (matchingCountry) {
                results = matchingCountry.cities;
            } else {
                // Try matching specific city name
                data.countries.forEach(country => {
                    const matchedCities = country.cities.filter(city => city.name.toLowerCase().includes(input));
                    results.push(...matchedCities);
                });
            }
        }

        if (results && results.length > 0) {
            results.forEach(element => {
                resultDiv.innerHTML += `
                    <div class="card-holder-2" style="background: rgba(0,0,0,0.7); color: white; margin-bottom: 20px; border-radius: 8px; overflow: hidden; max-width: 400px;">
                        <img src="${element.imageUrl}" alt="${element.name}" style="width: 100%; height: 220px; object-fit: cover;">
                        <div style="padding: 15px;">
                            <h2 style="margin-top: 0; color: #4ec9b0;">${element.name}</h2>
                            <p style="font-size: 0.95rem; line-height: 1.5;">${element.description}</p>
                            <button id="visit" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Visit</button>
                        </div>
                    </div>
                `;
            });
        } else {
            resultDiv.innerHTML = '<p style="color: white; padding: 10px;">Destination not found. Try searching for "beach", "temple", or "country".</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching travel recommendations:', error);
        resultDiv.innerHTML = '<p style="color: white; padding: 10px;">An error occurred while fetching recommendations.</p>';
      });
}

if (btnSearch) {
    btnSearch.addEventListener('click', searchDestination);
}
