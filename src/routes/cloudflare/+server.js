import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { CLOUDFLAREAPIKEY, CLOUDFLAREID, TINYFYAPIKEY} from '$env/static/private';

const accountID = CLOUDFLAREID;
const token = CLOUDFLAREAPIKEY;

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountID}/ai/run/@cf/facebook/detr-resnet-50`;
  const limit = parseInt(4 * 1024 * 1024); // 2MB
  let body = await request.blob();
  console.log("size before "+body.size);

  if (body.size > limit ) {
    body = await resizeImage(body, limit);
  }

  console.log("size after "+body.size);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'image/*', // Forward content type from the request
      },
      body: body,
    });

    let res = await response.json();
    console.log(res);
    res = res.result;
    let tempLabel = [];
    let tobedeleted = [];


    for (let i = 0; i < res.length; i++) {
        if (res[i].score > 0.01) {
            if (tempLabel.includes(res[i].label)) {
                tobedeleted.push(i);
            } else {
                tempLabel.push(res[i].label);
            }
        } else {
            tobedeleted.push(i);
        }
    }

    for (let i = tobedeleted.length - 1; i >= 0; i--) {
        res.splice(tobedeleted[i], 1);
    }

    return json(res);
  } catch (err) {
    return error(500, err.message)
  }
}


async function resizeImage(blob, limit, quality = 95) {
  try {
      // Convert the Blob to a Buffer
      // const buffer = await blob.arrayBuffer();
      // const inputBuffer = Buffer.from(buffer);

      // Compress the image buffer
      const res = await fetch("https://api.tinify.com/shrink", {
        method: 'POST',
        headers: {
          'Content-Type': 'image/*',
          'Authorization': 'Basic ' + TINYFYAPIKEY,
        },
        body: blob,
      });
      let compressedUrl = await res.json();
      console.log(compressedUrl);
      compressedUrl = compressedUrl.output.url;
      const compressedBlob = await fetch(compressedUrl).then((res) => res.blob());

      // if (compressedBlob.size > limit) {
      //   return resizeImage(blob, limit, quality - 5);
      // }

      return compressedBlob;
      
  } catch (error) {
      console.error('Error compressing image:', error);
      throw error; // Propagate the error
  }
}
