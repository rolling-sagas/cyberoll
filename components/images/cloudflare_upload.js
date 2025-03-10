export async function Upload(formData) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_UPLOAD_TOKEN}`,
      },
      body: formData,
    },
  );

  console.log(process.env.CLOUDFLARE_UPLOAD_TOKEN, process.env.CLOUDFLARE_ACCOUNT_ID)

  if (!response.ok) {
    const json = await response.json();
    console.log(response.status, json)
    throw new Error("Can't upload the picture");
  }
  // Your image has been uploaded
  // Do something with the response, e.g. save image ID in a database
  return await response.json();
}
