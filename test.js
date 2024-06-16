const sharp =require('sharp');
const fs=require('fs')
async function main(){
    const cmimg=await sharp('./public/images/Godope..png')
    .resize({
        width:100,
        height:50
    })
    .toFormat('jpeg',{mozjpeg: true })
    .toBuffer()
    // console.log(cmimg);
    const img=fs.createReadStream(cmimg)
    console.log("url",img);
    
}
main()