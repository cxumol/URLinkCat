const myheaders = {
	Origin: window.location.origin,
	'Content-Type': 'text/plain'
};

async function getDefaultData() {
	const response = await fetch(`/data_default.json`);
	if (!response.ok) {
		throw new Error(response);
	} else {
		return await response.json();
	}
}

function dataKeysUpdate(template, toAlign) {
	for (const k of Object.keys(template)) {
		if (!toAlign.hasOwnProperty(k)) {
			console.log(`data field updated implicitly, updated key:${k}`);
			toAlign[k] = template[k];
		}
	}
	return toAlign;
}

class DB {
	constructor(cf_workers, username) {
		this.cf_workers = cf_workers;
		this.username = username;
		this.needToken = null;
	}

	async getData() {
		const defaultData = getDefaultData();
		const response = await fetch(`https://${this.cf_workers}/get/${this.username}`, {
			headers: myheaders
		});
		if (!response.ok) {
			// use default data
			return getDefaultData();
		}
		if (response.headers.get('x-need-token')) {
			this.needToken = true;
			console.log('A token is required to edit this page');
		} else {
			this.needToken = false;
		}
		const result = await response.json();
		const cloudData = dataKeysUpdate(defaultData, result);
		return cloudData;
	}

	async uploadData(myDataStr) {
		const response = await fetch(`https://${this.cf_workers}/set/${this.username}`, {
			headers: myheaders,
			method: 'POST',
			body: myDataStr
		});
		if (!response.ok) {
			response.text().then((msg) => alert(`unsuccessful data uploading \nReason: ${msg}`));
			return { uploadingState: 'bad' };
		}
		return { uploadingState: 'ok' };
	}
}

export { getDefaultData, DB };
