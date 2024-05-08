import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { CLOUDFLAREAPIKEY, CLOUDFLAREID } from '$env/static/private';

const accountID = CLOUDFLAREID;
const token = CLOUDFLAREAPIKEY;

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountID}/ai/run/@cf/facebook/detr-resnet-50`;
  const body = await request.blob();

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