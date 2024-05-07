<script>
    import { FileDropzone } from '@skeletonlabs/skeleton';
    import axios from 'axios';
  
    let uploadedImage;
  
    async function handleFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = async () => {
        uploadedImage = reader.result;
  
        // Read the file as ArrayBuffer
        const arrayBuffer = reader.result;
        
        // Send the ArrayBuffer to the Cloudflare API
        sendToCloudflare(arrayBuffer);
      };
  
      reader.readAsArrayBuffer(file);
    }
  
    async function sendToCloudflare(arrayBuffer) {
      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(arrayBuffer);
  
      const options = {
        method: 'POST',
        url: 'https://api.cloudflare.com/client/v4/accounts/c74bb52bf7a5b1a049941023335ebc73/ai/run/@cf/facebook/detr-resnet-50',
        headers: {
          'Content-Type': 'application/octet-stream',
          Authorization: 'Bearer nj1tPI0g-J72XG9bK4hEj_gXFp2LU14twD-V6Xv1',
        },
        data: uint8Array,
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
    <div class="card card-hover block flex h-[60vh] w-[20%] flex-col justify-start gap-10 p-4 pt-20 text-center">
      <h3 class="h3 font-semibold">Upload Picture</h3>
      <FileDropzone name="files" accept="image/*" class="h-[50%]" on:change={handleFileChange} />
    </div>
  
    <div class="card card-hover block flex w-[80%] flex-col items-center justify-center p-20 text-center">
      {#if uploadedImage}
        <div class="flex w-full items-start justify-left w-[20%]">
          <img alt class="h-auto w-[40%] rounded-lg" src={uploadedImage} />
        </div>
      {:else}
        <h3 class="h3 font-semibold">Uploaded Picture</h3>
        No files uploaded
      {/if}
    </div>
  </div>
  