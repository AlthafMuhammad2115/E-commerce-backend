const { removeBackground } = require("@imgly/background-removal-node"); // Assuming default export
const fs=require('fs');

const public_path = "./public/images/"; // the path assets are served from


const config = {
  publicPath: public_path, // path to the wasm files
};

let image_src = "./public/images/1717486347268-IMG_0855.jpeg"; // You'll need to assign the image source (string path, Blob, etc.)

async function main() {
  const blob = await removeBackground(image_src);
  const buffer = Buffer.from(await blob.arrayBuffer());
  const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
  fs.writeFileSync('./public/images/output.png', dataURL.split(';base64,').pop(), { encoding: 'base64' });
}

main()