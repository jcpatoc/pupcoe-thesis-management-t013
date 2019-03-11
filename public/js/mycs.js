

function Cart()
	{
	var nc = document.getElementById('NavCart').style;

	nc.width="35%";
	nc.height="100%";
	nc.display="block";
	}

function closeNavCart ()
	{
	var nc = document.getElementById('NavCart');
	nc.style.width="0";
	}


function DetailsPopUp(id)
	{
	document.getElementById('DetailsPopUp'+id).style.display="block";
	document.getElementById('content').style.opacity = "0.5";
	}

function closeDetailsPopUp(id)
	{
	document.getElementById('DetailsPopUp'+id).style.display="none";
	document.getElementById('content').style.opacity = "1";
	document.getElementById('info'+id).style.display="none";
	}

function showInfo(id)
	{
	var ai = document.getElementById('info'+id).style;

	if (ai.display === "none")
		{
			ai.display ="block";
			document.getElementById("info"+id).focus();
		}
	else 	
		{
			ai.display ="none";
		}

	}

