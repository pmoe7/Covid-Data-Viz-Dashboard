window.onload = function() {
	allMaps();
	allTop();
	allBot();
	allWc();
};

const viewChanger = document.getElementById('views');

viewChanger.addEventListener('change', (event) => {
	if (event.target.value == "all")
	viewAll();

	else if(event.target.value == "na")
		viewNA();
	else if (event.target.value == "sa")
		viewSA();
});

function viewAll(){
	allMaps();
	allTop();
	allBot();
	allWc();
}

function viewNA(){
	naMap();
	naTop();
	naBot();
	naWc();
}

function viewSA(){
	saMap();
	saTop();
	saBot();
	saWc();
}


function goBack(){
    document.getElementById("views").style.opacity = "1";
    document.getElementById("info").style.opacity = "1";
    document.getElementById("title").innerHTML = "Weekly Covid Dashboard by Mohammed Perves"; 
    var container = document.getElementById("all_container")
    container.style.display = "none";

	if(document.getElementById('views').value == "all")
		allMaps();
   	else if(document.getElementById('views').value == "na")
		naMap();
   	else if(document.getElementById('views').value == "sa")
   		saMap();
}

function formatNum(num){
	return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 9 }).format(num);
  };
