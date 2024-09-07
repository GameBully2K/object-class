<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import axios from 'axios';
	import { onMount } from 'svelte';

	let uploadedImage;
	let blob;
	let ctrlSwitch = "px-4 py-2 variant-ghost flex items-center justify-center rounded-lg";
	let vSwitch = "px-4 py-2 variant-ghost flex items-center justify-center rounded-lg";

	$:if (uploadedImage) {
		document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
	}

	onMount(async () => {
		document.addEventListener('paste', handlePaste);
		document.addEventListener('keydown', (event) => {
			if (event.ctrlKey) {
				ctrlSwitch = "px-4 py-2 bg-primary-500 flex items-center justify-center rounded-lg";
			}
			if (event.key === 'v') {
				vSwitch = "px-4 py-2 bg-primary-500 flex items-center justify-center rounded-lg";
			}
		});
		document.addEventListener('keyup', (event) => {
			if (!event.ctrlKey) {
				ctrlSwitch = "px-4 py-2 variant-ghost flex items-center justify-center rounded-lg";
			}
			if (event.key === 'v') {
				vSwitch = "px-4 py-2 variant-ghost flex items-center justify-center rounded-lg";
			}
		});
	});

	async function handlePaste(event) {
		
		const items = (event.clipboardData || window.clipboardData).items;

		
		const item = items[0];

		if (item.type.indexOf('image') !== -1) {
			const file = item.getAsFile();
			const urlReader = new FileReader();
			urlReader.onload = async () => {
				uploadedImage = urlReader.result;
				blob = await fetch(uploadedImage).then((res) => res.blob());
				document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
			};
			urlReader.readAsDataURL(file);
		}
	}

	async function handleFileChange(event) {
		const file = event.target.files[0];
		const urlReader = new FileReader();

		urlReader.onload = async () => {
			uploadedImage = urlReader.result;
		};
		urlReader.readAsDataURL(file);

		const blobReader = new FileReader();

		blobReader.onload = async () => {
			blob = new Blob([blobReader.result], { type: "image/*" });
		};
		blobReader.readAsArrayBuffer(file);
	}

	async function handleURLChange(event) {
		uploadedImage = event.target.value;
		blob = await fetch(uploadedImage).then((res) => res.blob());
	}
</script>

<div class="flex flex-col md:flex-row gap-6 p-4 md:p-20 ">
	<div
		class="card card-hover block flex h-[60vh] w-[100%] md:w-[24%] md:p-4 flex-col justify-center gap-4 p-2 text-center"
	>
		<h3 class="h3 font-semibold">Upload Picture</h3>
		<FileDropzone name="files" accept="image/*" class="h-[50%]" on:change={handleFileChange} />
		<label class="label">
			<span class="h3 font-semibold">URL</span>
			<input
				class="input text-center md:text-left"
				type="url"
				placeholder="https://examples.com/image.png"
				on:change={handleURLChange}
			/>
		</label>
		<p class="p">or simply paste the image from you clipboard with</p>
		<div class="flex flex-row gap-4 items-center justify-center font-bold invisible md:visible">
			<div class={ctrlSwitch}>Ctrl</div>
			<p>+</p>
			<div class={vSwitch}>V</div>
		</div>
	</div>

	<div
		id="results"
		class="card card-hover block flex w-[100%] md:w-[80%] h-[95vh] md:h-auto flex-col items-center justify-center p-2 md:p-10 px-10 md:px-20 text-center"
	>
		{#if uploadedImage}
			<div class="justify-left flex w-full items-start flex-col md:flex-row">
				<img alt class="w-[100%] md:w-[50%] h-[50vh] object-cover rounded-lg" src={uploadedImage} />
				<div class="flex  w-[100%] md:w-[50%] h-[30vh] md:h-full flex-col items-center justify-center gap-4">
					<h3 class="h2 font-semibold">Results</h3>
					{#if blob}
						{#await axios.post('/cloudflare', blob, { headers: { 'Content-Type': 'image/*' } })}
							<div class="flex flex-row gap-4 items-center justify-center">
								<div class="placeholder-circle w-10 animate-pulse" />
								<div class="placeholder w-20 animate-pulse" />
							</div>
						{:then response}
							<nav class="list-nav">
								<ul>
									<div
										class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex flex-col gap-4 overflow-x-auto px-4 items-start justify-start"
									>
										{#if response.data.length != 0}
											{#each response.data as item}
												<li >
														<span class="badge w-14 h-10 font-2 bg-primary-500"
															>{Math.round(item.score * 100) == 100
																? 99
																: Math.round(item.score * 100)}%</span
														>
														<span class="h3 flex-auto text-start font-semibold">{item.label}</span>
												</li>
											{/each}
										{:else}
											<li>
												<span class="h3 flex-auto text-start font-semibold">No results found</span>
											</li>
										{/if}
									</div>
								</ul>
							</nav>
						{:catch error}
							{#if error.message.includes('status code 403')}
								<div class="alert-error alert">
									<p>Not Autorized</p>
								</div>
							{:else}
							<div class="alert-error alert">
								<p>{error.message}</p>
							</div>
							{/if}
						{/await}
					{/if}
				</div>
			</div>
		{:else}
			<h3 class="h3 font-semibold">Uploaded Picture</h3>
			No files uploaded
		{/if}
	</div>
</div>
