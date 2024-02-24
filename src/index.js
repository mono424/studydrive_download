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
		const match = /"file_preview":("[^"]*")/.exec(html);
		if (!match) {
			console.error('[StudyDrive Download] File preview not found', html);
			return;
		}
		const parsedLink = JSON.parse(match[1]);
		window.open(parsedLink, '_blank');
	});

	function rebindButton(button, listener) {
		const parent = button.parentElement;
		const newButton = button.cloneNode(true);
		parent.replaceChild(newButton, button);
		newButton.onclick = listener;
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