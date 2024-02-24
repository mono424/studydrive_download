(async function() {
	const downloadButton = await findDownloadButton(1000, 200);

	if (!downloadButton) {
		console.error('[StudyDrive Download] Download button not found');
		return;
	}

	downloadButton.classList.add("!border-primary", "text-primary");
	rebindButton(downloadButton, async () => {
		const result = await fetch(window.location.href);
		const html = await result.text();

		
		const parsedLink = getDownloadLink(html);
		if (!parsedLink) {
			console.error('[StudyDrive Download] Download link not found', html);
			return;
		}

		const fileName = getFileName(html);

		const downloadResult = await fetch(parsedLink);
		const blob = await downloadResult.blob();
		downloadFile(blob, fileName);
	});

	function getDownloadLink(html) {
		const linkMatch = /"file_preview":("[^"]*")/.exec(html);
		if (!linkMatch) {
			return null;
		}
		return JSON.parse(linkMatch[1]);
	}

	function getFileName(html) {
		const fileNameMatch = /"filename":("[^"]*")/.exec(html);
		if (!fileNameMatch) {
			return "preview.pdf";
		}
		return JSON.parse(fileNameMatch[1]);
	}

	function rebindButton(button, listener) {
		const parent = button.parentElement;
		const newButton = button.cloneNode(true);
		parent.replaceChild(newButton, button);
		newButton.onclick = listener;
	}

	function downloadFile(blob, fileName) {
		var link = document.createElement('a');
		link.download = fileName;
		link.href = window.URL.createObjectURL(blob);
		link.target = "_blank";
		link.click();
	}
	
	async function findDownloadButton(maxTries, timeout) {
		let downloadButton = null;

		while (!downloadButton && maxTries > 0) {
			downloadButton = [...document.querySelectorAll('button')]
			.find(btn => btn.innerHTML.includes('icon-downloads'))
			await new Promise(resolve => setTimeout(resolve, timeout));
			maxTries--;
		}

		return downloadButton;
	}
})();