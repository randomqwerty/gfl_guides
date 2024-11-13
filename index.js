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
	});
	
	function UpdateData() {		
		$.getJSON('./guide_export.json', function(data){
			// Get selected guide, filter the JSON, extract only 
			var guide = $('[name="selectGuide"]').val();
			var filteredData = data.filter(x => x.title == guide);
			
			// Extract subtitle and data from the JSON
			sub_title_orig = filteredData.map(function (x) {return x.sub_title;})
			data_orig = filteredData.map(function (x) {return x.data;})
			
			// Keep only the first instance of each subtitle
			sub_title = [];
			sub_title_orig.forEach((item, index) => {
				sub_title.push(index == 0 ? item : (item == sub_title_orig[index-1] ? '' : item));
			});
			
			// Insert subtitles where applicable
			data = [];
			data_orig.forEach((item, index) => {
				data.push(sub_title[index] == '' ? data_orig[index] : '<h2>' + sub_title[index] + '</h2><br>' + data_orig[index]);
			});
			
			// Populate divs
			$('#guideHeader').text(filteredData[0].title);
			$('#guideDesc').text(filteredData[0].description);
			$('#guideAuthors').text('By: ' + filteredData[0].authors);
			$('#guideData').html(data.join('<br>'));
		});
	};