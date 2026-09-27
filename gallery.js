async function loadGitHubImages(folder){

const repo = "miladgh97/HananehAliyari";

const url =
`https://api.github.com/repos/${repo}/contents/assets/images/${folder}`;

const response = await fetch(url);

const files = await response.json();


return files
.filter(file =>
file.type === "file" &&
file.name.match(/\.(jpg|jpeg|png|webp)$/i)
)
.sort((a,b)=>a.name.localeCompare(b.name))
.map(file=>file.download_url);

}



async function createGallery(folder,target){

const container=document.getElementById(target);

if(!container) return;


const images=await loadGitHubImages(folder);


images.forEach(image=>{


const img=document.createElement("img");

img.src=image;

img.loading="lazy";

img.className="portfolio-image";


container.appendChild(img);


});


}




createGallery(
"series-01",
"series-01"
);


createGallery(
"series-02",
"series-02"
);


createGallery(
"series-03",
"series-03"
);


createGallery(
"series-04",
"series-04"
);


createGallery(
"series-05",
"series-05"
);


createGallery(
"singles",
"singles"
);
