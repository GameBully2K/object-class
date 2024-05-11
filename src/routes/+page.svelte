<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import axios from 'axios';
	import { onMount } from 'svelte';

	onMount(async () => {
		document.addEventListener('paste', handlePaste);
	});

	let uploadedImage;
	let blob;

	async function handlePaste(event) {
		
		const items = (event.clipboardData || window.clipboardData).items;

		
		const item = items[0];

		if (item.type.indexOf('image') !== -1) {
			const file = item.getAsFile();
			const reader = new FileReader();
			reader.onload = async () => {
				uploadedImage = reader.result;
				blob = await fetch(uploadedImage).then((res) => res.blob());
			};
			reader.readAsDataURL(file);
		}
	}

	async function handleFileChange(event) {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = async () => {
			uploadedImage = reader.result;
			blob = await fetch(uploadedImage).then((res) => res.blob());
		};
		reader.readAsDataURL(file);
	}

	async function handleURLChange(event) {
		uploadedImage = event.target.value;
		blob = await fetch(uploadedImage).then((res) => res.blob());
	}
</script>

<div class="flex gap-6 p-20">
	<div
		class="card card-hover block flex h-[60vh] w-[20%] flex-col justify-center gap-4 p-4 text-center"
	>
		<h3 class="h3 font-semibold">Upload Picture</h3>
		<FileDropzone name="files" accept="image/*" class="h-[50%]" on:change={handleFileChange} />
		<label class="label">
			<span class="h3 font-semibold">URL</span>
			<input
				class="input"
				type="url"
				placeholder="https://examples.com/image.png"
				on:change={handleURLChange}
			/>
		</label>
		<p class="p">or simply paste the image from you clipboard with CTRL+V</p>
	</div>

	<div
		class="card card-hover block flex w-[80%] flex-col items-center justify-center p-10 px-20 text-center"
	>
		{#if uploadedImage}
			<div class="justify-left flex w-[20%] w-full items-start">
				<img alt class="w-[50%] h-[50vh] object-cover rounded-lg" src={uploadedImage} />
				<div class="flex h-full w-[50%] flex-col items-center justify-center gap-4">
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
										class="flex flex-col snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 py-10 items-start justify-center"
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
							<div class="alert-error alert">
								<p>{error.message}</p>
							</div>
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
