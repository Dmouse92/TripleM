function loadListings() {
	console.log('Grabbing JSON...')
    fetch('cars.json')
      .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            
        })
        .catch(function() {
            console.log("An error occurred while fetching the JSON file.");
        });
}
}
