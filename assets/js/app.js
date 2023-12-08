let cl = console.log;

/// posts => create object
//// GET=>dta get from dtatbase
////patch and put=>uppdate
//////delete
let card = document.getElementById('card')
let postformcontrol = document.getElementById('postform');

let titlecontrol = document.getElementById('title');
let bodycontrol = document.getElementById('body');
let useridcontrol = document.getElementById('userid');
cl(useridcontrol)
let updatecontrol = document.getElementById('update');
let addbtn = document.getElementById('addbtn');
let loadercontrol = document.getElementById('loader');






let baseurl = `https://jsonplaceholder.typicode.com`



let posturl = `${baseurl}/posts`
cl(posturl)


///2>configuration


// let xhr = new XMLHttpRequest();


// xhr2.open('GET', xhr);


// xhr2.send()

let postarry = [];



let tempalting = (arr => {
	let result = ``;
	arr.forEach(ele => {
		result += `  <div class="card mb-4"id="${ele.id}">
                                  <div class="card-header">
                           <h1>
                                  ${ele.title}
                         </h1>
                                </div>
                                           <div class="card-body">
                                              <p>
                                                ${ele.body}
                                            </div>
        <div class="card-footer  d-flex justify-content-between">
            <button class="btn btn-primary" onclick="edithandler(this)"> edit</button>
            <button class="btn btn-danger"onclick="deletehandler(this)"> delete</button>
        </div>
    </div>`
	});
	card.innerHTML = result;
})
const onpostcreate = (ele) => {
	ele.preventDefault();
	let newobj = {
		title: titlecontrol.value,
		body: bodycontrol.value,
		userid: useridcontrol.value
	}
	cl(newobj);

	genericFun('POST', posturl, newobj);
	loadercontrol.classList.remove('d-none')
	Swal.fire({
		title: "Good job!",
		text: "post created",
		icon: "success"
	});
}
const edithandler = (eve) => {
	cl(eve)

	let getid = eve.closest('.card').id;
	cl(getid)
	let set = localStorage.setItem('grt', getid)
	let geturl = `${posturl}/${getid}`
	cl(geturl);

	updatecontrol.classList.remove('d-none')
	addbtn.classList.add('d-none')

	genericFun('GET', geturl)

}

const updatehandler = (ele) => {
	cl(ele);
	let newobj = {
		title: titlecontrol.value,
		body: bodycontrol.value,
		userid: useridcontrol.value
	}
	cl(newobj)
	let updatedid = localStorage.getItem('grt');
	cl(updatedid);
	let updateurl = `${posturl}/${updatedid}`;

	cl(updateurl);

	genericFun('PUT', updateurl, newobj);
	Swal.fire({
		title: "Good job!",
		text: "You clicked the button!",
		icon: "success"
	});
}

const deletehandler = (ele) => {
	let deleteid = ele.closest('.card').id; /// gets id of acrd
	localStorage.setItem('del2', deleteid)
	let deleteurl = `${posturl}/${deleteid}` ////////adds url for delete
	// let deletecard = document.getElementById(deleteid);/////deleting from ul
	// deletecard.remove();
	Swal.fire({
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes, delete it!"
	}).then((result) => {

		if (result.isConfirmed) {

			genericFun('DELETE', deleteurl) /// api call
			Swal.fire({
				title: "Deleted!",
				text: "Your file has been deleted.",
				icon: "success"
			});
		}
	});

}



const genericFun = (methodName, apiUrl, bodymsg = null) => {
	loadercontrol.classList.remove('d-none')
	let xhr = new XMLHttpRequest();

	xhr.open(methodName, apiUrl)

	xhr.send(JSON.stringify(bodymsg))

	xhr.onload = function () {
		loadercontrol.classList.add('d-none')
		if (xhr.status >= 200 || xhr.status <= 299 && xhr.readyState === 4) {
			// cl(xhr.response)
			if (methodName === "GET") {
				let json = JSON.parse(xhr.response)
				// tempalting(json)
				if (Array.isArray(json)) {
					tempalting(json)
				} else {
					titlecontrol.value = json.title;
					bodycontrol.value = json.body;
					useridcontrol.value = json.userId;
				}
			} else if (methodName === 'PUT') {
				cl(xhr.response);
				let updatedid2 = JSON.parse(xhr.response).id; /// single object gets id
				let card23 = document.getElementById(updatedid2); ///// edited card's id
				cl(card23);
				let get245 = [...card23.children]; ////// crad childrens connverted into array

				cl(get245);
				get245[0].innerHTML = `<h2>${bodymsg.title}</h2>` /// sets value
				get245[1].innerHTML = `<p>${bodymsg.body}</p>` /////// sets value


				postformcontrol.reset();
				updatecontrol.classList.add('d-none');
				addbtn.classList.remove('d-none')


			} else if (methodName === 'DELETE') {

				let deletecradid = localStorage.getItem('del2');
				cl(deletecradid);
				let delete2 = document.getElementById(deletecradid);
				delete2.remove(); /// ui and datbase

			} else if (methodName === 'POST') {

				let card2 = document.createElement('div');
				card2.className = 'card mb-4';
				let postid = JSON.parse(xhr.response);
				card2.id = postid.id;
				card2.innerHTML = `
                                   <div class="card-header">
                           <h1>
                                  ${bodymsg.title}
                         </h1>
                                </div>
                                           <div class="card-body">
                                              <p>
                                                ${bodymsg.body}
                                            </div>
        <div class="card-footer  d-flex justify-content-between">
            <button class="btn btn-primary" onclick="edithandler(this)"> edit</button>
            <button class="btn btn-danger"onclick="deletehandler(this)"> delete</button>
        </div>
      `
				card.append(card2);
				cl(card2);


			}

		}



	}
	xhr.onerror = function () {
		loadercontrol.classList.add('d-none')


	}

}
genericFun("GET", posturl)






postformcontrol.addEventListener('submit', onpostcreate)
updatecontrol.addEventListener('click', updatehandler)