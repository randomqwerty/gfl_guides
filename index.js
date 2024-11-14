	$(document).ready(function(){	
		// Populate guide selector with list of files, remove blank option
		var selectGuide = document.getElementById("selectGuide");
		for(var i = 0; i < guideNames.length; i++) {
			var opt = guideNames[i];
			var el = document.createElement("option");
			el.textContent = opt;
			el.value = opt;
			selectGuide.appendChild(el);
		};
		
		// Get query strings from URL
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		var guide = urlParams.get("guide");
		
		// Load data if query strings are not blank
		if (guide != null) {
			$('[name="selectGuide"]').val(guide);
			UpdateData();
		};	
	});
	
	function UpdateData() {		
		$.getJSON('./guide_export.json', function(data){
			// Get selected guide, filter the JSON, extract only 
			var guide = $('[name="selectGuide"]').val();
			var filteredData = data.filter(x => x.title == guide);
			
			// Extract subtitle, data, and filenames from the JSON
			sub_title_orig = filteredData.map(function (x) {return x.sub_title;})
			data_orig = filteredData.map(function (x) {return x.data;})
			fname = filteredData.map(function (x) {return x.filename;})
			
			// Keep only the first instance of each subtitle
			sub_title = [];
			sub_title_orig.forEach((item, index) => {
				sub_title.push(index == 0 ? item : (item == sub_title_orig[index-1] ? '' : item));
			});
			
			// Insert subtitles and filenames into the data where applicable
			data_final = [];
			data_orig.forEach((item, index) => {
				var x = data_orig[index] ? data_orig[index] : (fname[index] ? '<img width=50% src="assets/' + fname[index] + '">' : '');
				
				x = sub_title[index] == '' ? x : '<h2>' + sub_title[index] + '</h2><br>' + x;
				x = x.replaceAll('src="/girlsfrontline/sites/girlsfrontline/files/inline-images/', 'src="assets/').replaceAll(null, '');
				data_final.push(x);
			});
			
			// Populate divs
			console.log(filteredData[0].title);
			$('#guideHeader').html(filteredData[0].title ? '<h1>' + filteredData[0].title + '</h1>' : 'Missing Title');
			$('#guideDesc').text(filteredData[0].description ? filteredData[0].description : 'Missing Description');
			$('#guideAuthors').text(filteredData[0].authors ? 'Authors: ' + filteredData[0].authors : 'Missing Authors');
			$('#guideData').html(data_final.join('<br>'));
			
			// Update URL with new query strings if applicable
			var newURL;
			var baseURL = window.location.href.split('?')[0];
			if (guide.length != 0) {
				newURL = encodeURI(baseURL + "?guide=" + guide);
			} else {
				newURL = baseURL;
			};
			window.history.pushState('obj', 'Title', newURL);
		});
	};