async function loadGitHubImages(folder) {
    const repo = "miladgh97/HananehAliyari";
    const branch = "main";

    const apiUrl = `https://api.github.com/repos/${repo}/contents/assets/images/${folder}?ref=${branch}`;

    try {
        const response = await fetch(apiUrl);
        const files = await response.json();

        return files
            .filter(file => {
                return file.type === "file" &&
                /\.(jpg|jpeg|png|webp)$/i.test(file.name);
            })
            .sort((a,b) => a.name.localeCompare(b.name))
            .map(file => file.download_url);

    } catch(error) {
        console.error("Gallery loading error:", error);
        return [];
    }
}


async function createGallery(folder, containerId){

    const container = document.getElementById(containerId);

    const images = await loadGitHubImages(folder);

    if(images.length === 0){
        container.innerHTML = "تصویری وجود ندارد";
        return;
    }


    images.forEach((img,index)=>{

        const image = document.createElement("img");

        image.src = img;
        image.loading = "lazy";

        image.className = "portfolio-image";

        if(index !== 0){
            image.style.display="none";
        }

        container.appendChild(image);

    });

}


// رشته استوری ها

createGallery(
    "series-01",
    "series01"
);


createGallery(
    "series-02",
    "series02"
);


createGallery(
    "series-03",
    "series03"
);


createGallery(
    "series-04",
    "series04"
);


createGallery(
    "series-05",
    "series05"
);


// تک استوری

createGallery(
    "singles",
    "singles"
);
