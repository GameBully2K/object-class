<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import axios from 'axios';

	let uploadedImage;
	let image;
	let promise;

    const accountID = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
    const token = import.meta.env.CLOUDFLARE_TOKEN;

	async function handleFileChange(event) {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = async () => {
			uploadedImage = reader.result;
		};
		reader.readAsDataURL(file);
		image = await fetch(uploadedImage).then((res) => res.blob());
		promise = await sendToCloudflare(image);
        console.log(promise);
	}

	async function handleURLChange() {
		image = await fetch(uploadedImage).then((res) => res.blob());
		promise = await sendToCloudflare(image);
	}

	async function sendToCloudflare(blob) {
		const options = {
			method: 'POST',
			url: 'https://api.cloudflare.com/client/v4/accounts/'+accountID+'/ai/run/@cf/facebook/detr-resnet-50',
			headers: {
				'Content-Type': 'application/octet-stream',
				Authorization: 'Bearer '+token
			},
			data: blob
		};

		try {
			const response = await axios.request(options);
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="flex gap-6 p-20">
	<div
		class="card card-hover block flex h-[60vh] w-[20%] flex-col justify-center gap-4 p-4 text-center"
	>
		<h3 class="h3 font-semibold">Upload Picture</h3>
		<FileDropzone name="files" accept="image/*" class="h-[50%]" on:change={handleFileChange} />
		<label class="label">
			<span class="h3 font-semibold">Input</span>
			<form on:submit|preventDefault={handleURLChange}>
				<input
					class="input"
					type="url"
					placeholder="https://examples.com/image.png"
					bind:value={uploadedImage}
				/>
			</form>
		</label>
	</div>

	<div
		class="card card-hover block flex w-[80%] flex-col items-center justify-center p-10 px-20 text-center"
	>
		{#if uploadedImage}
			<div class="justify-left flex w-[20%] w-full items-start">
				<img alt class="h-auto w-[50%] rounded-lg" src={uploadedImage} />
				<div class="flex h-full w-[60%] flex-col items-center justify-center gap-4">
					<h3 class="h2 font-semibold">Results</h3>
                    <!-- {#await promise}
						<div class="flex flex-col items-center justify-center">
							<div class="placeholder-circle w-16" />
							<div class="placeholder" />
						</div>
					{:then response}
						<nav class="list-nav">
							<ul>
								<div
									class="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 py-10"
								>
									{#each response.result as item}
										<li>
											<a href="/elements/lists">
												<span class="badge bg-primary-500"
													>{Math.round(item.score * 100) == 100
														? 99
														: Math.round(item.score * 100)}%</span
												>
												<span class="h3 flex-auto text-start font-semibold">{item.label}</span>
											</a>
										</li>
									{/each}
								</div>
							</ul>
						</nav>
					{:catch error}
						<div class="alert-error alert">
							<p>{error.message}</p>
						</div>
					{/await} -->
                    
                    <nav class="list-nav">
                        <ul>
                            <div
                                class="flex flex-col snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 py-10"
                            >
                                {#each [{color:"red", score:0.9990994930267334}, {color:"green", score:0.785994930267334} ] as item}   
                                    <li>
                                        <a href="/elements/lists">
                                            <span class="badge bg-primary-500"
                                                >{Math.round(item.score * 100) == 100
                                                    ? 99
                                                    : Math.round(item.score * 100)}%</span
                                            >
                                            <span class="h3 flex-auto text-start font-semibold">{item.label}</span>
                                        </a>
                                    </li>
                                {/each}
                            </div>
                        </ul>
                    </nav>
				</div>
			</div>
		{:else}
			<h3 class="h3 font-semibold">Uploaded Picture</h3>
			No files uploaded
		{/if}
	</div>
</div>
